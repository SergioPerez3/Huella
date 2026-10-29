import crypto from "crypto";
import Pet from "../models/Pet.js";
import HealthRecord from "../models/HealthRecord.js";
import pick from "../utils/pick.js";

const fields = [
  "enabled",
  "ownerPhone",
  "vetContact",
  "instructions",
  "showAllergies",
  "showMedication",
];

const newToken = () => crypto.randomBytes(24).toString("base64url");
const buildUrl = (token) =>
  token ? `${process.env.CLIENT_URL}/e/${token}` : null;

const respond = (res, pet) =>
  res.status(200).json({
    data: {
      emergency: pet.emergency,
      publicUrl: buildUrl(pet.emergency.publicToken),
    },
  });

export const updateEmergency = async (req, res, next) => {
  try {
    for (const [key, value] of Object.entries(pick(req.body, fields))) {
      req.pet.set(`emergency.${key}`, value);
    }
    if (req.pet.emergency.enabled && !req.pet.emergency.publicToken) {
      req.pet.emergency.publicToken = newToken();
    }
    await req.pet.save();
    respond(res, req.pet);
  } catch (error) {
    next(error);
  }
};

export const regenerateToken = async (req, res, next) => {
  try {
    if (!req.pet.emergency.enabled) {
      return res
        .status(400)
        .json({ error: { message: "Emergency card is not enabled" } });
    }
    req.pet.emergency.publicToken = newToken();
    await req.pet.save();
    respond(res, req.pet);
  } catch (error) {
    next(error);
  }
};

export const getPublicCard = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({
      "emergency.publicToken": req.params.token,
      "emergency.enabled": true,
    });
    if (!pet)
      return res.status(404).json({ error: { message: "Card not found" } });

    const { emergency } = pet;
    const data = {
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      photo: pet.photo?.url,
      ownerPhone: emergency.ownerPhone,
      vetContact: emergency.vetContact,
      instructions: emergency.instructions,
    };

    if (emergency.showAllergies) data.allergies = pet.allergies;

    if (emergency.showMedication) {
      const treatments = await HealthRecord.find({
        petId: pet._id,
        type: "treatment",
        $or: [
          { "treatment.endDate": { $gte: new Date() } },
          { "treatment.endDate": null },
        ],
      }).select("treatment.drug treatment.dose");
      data.medication = treatments.map((t) => ({
        drug: t.treatment.drug,
        dose: t.treatment.dose,
      }));
    }

    res.set("X-Robots-Tag", "noindex");
    res.set("Cache-Control", "no-store");
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
