import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import { registerUser, createPet } from "./helpers.js";

describe("Emergency card", () => {
  let agent;
  let pet;
  let base;

  const enable = (body = {}) =>
    agent.patch(base).send({ enabled: true, ownerPhone: "600123456", ...body });
  const publicCard = (token) =>
    request(app).get(`/api/v1/public/emergency/${token}`);

  beforeEach(async () => {
    ({ agent } = await registerUser());
    pet = await createPet(agent, {
      name: "Luna",
      breed: "Labrador",
      allergies: ["chicken"],
    });
    base = `/api/v1/pets/${pet._id}/emergency`;
  });

  it("requires authentication to configure the card", async () => {
    const res = await request(app).patch(base).send({ enabled: true });
    expect(res.status).to.equal(401);
  });

  it("generates a token and a public url when enabled", async () => {
    const res = await enable();
    expect(res.status).to.equal(200);
    expect(res.body.data.emergency.publicToken).to.have.length.of.at.least(32);
    expect(res.body.data.publicUrl).to.include(
      res.body.data.emergency.publicToken,
    );
  });

  it("keeps the same token when the card is updated again", async () => {
    const first = (await enable()).body.data.emergency.publicToken;
    const second = (await enable({ instructions: "Call me" })).body.data
      .emergency.publicToken;
    expect(second).to.equal(first);
  });

  it("rejects invalid values and blocks other users", async () => {
    expect((await enable({ enabled: "maybe" })).status).to.equal(400);
    const stranger = await registerUser();
    expect(
      (await stranger.agent.patch(base).send({ enabled: true })).status,
    ).to.equal(404);
  });

  it("cannot be changed through the normal pet update", async () => {
    const res = await agent
      .patch(`/api/v1/pets/${pet._id}`)
      .send({ emergency: { enabled: true } });
    expect(res.body.data.emergency.enabled).to.equal(false);
  });

  it("shows only safe fields by default", async () => {
    const token = (await enable({ vetContact: "Dr. Ruiz 910000000" })).body.data
      .emergency.publicToken;
    const res = await publicCard(token);
    expect(res.status).to.equal(200);
    expect(res.body.data).to.include({ name: "Luna", ownerPhone: "600123456" });
    ["_id", "owner", "allergies", "medication", "notes", "email"].forEach(
      (key) => {
        expect(res.body.data).to.not.have.property(key);
      },
    );
    expect(res.headers["x-robots-tag"]).to.equal("noindex");
  });

  it("shows allergies only when allowed", async () => {
    const token = (await enable({ showAllergies: true })).body.data.emergency
      .publicToken;
    const res = await publicCard(token);
    expect(res.body.data.allergies).to.deep.equal(["chicken"]);
  });

  it("shows only the active treatments when medication is allowed", async () => {
    const healthUrl = `/api/v1/pets/${pet._id}/health`;
    const base = { type: "treatment", date: "2026-10-01", title: "Treatment" };
    await agent.post(healthUrl).send({
      ...base,
      treatment: {
        drug: "Amoxicillin",
        dose: "250mg",
        endDate: "2099-01-01",
      },
    });
    await agent.post(healthUrl).send({
      ...base,
      treatment: { drug: "OldDrug", dose: "1mg", endDate: "2020-01-01" },
    });

    const token = (await enable({ showMedication: true })).body.data.emergency
      .publicToken;
    const res = await publicCard(token);
    expect(res.body.data.medication).to.have.length(1);
    expect(res.body.data.medication[0].drug).to.equal("Amoxicillin");
  });

  it("returns the same 404 for disabled and unknown cards", async () => {
    const token = (await enable()).body.data.emergency.publicToken;
    await agent.patch(base).send({ enabled: false });
    const disabled = await publicCard(token);
    const unknown = await publicCard("x".repeat(32));
    expect(disabled.status).to.equal(404);
    expect(unknown.status).to.equal(404);
    expect(disabled.body).to.deep.equal(unknown.body);
  });

  it("invalidates the old link when the token is regenerated", async () => {
    const oldToken = (await enable()).body.data.emergency.publicToken;
    const res = await agent.post(`${base}/regenerate`);
    const newToken = res.body.data.emergency.publicToken;
    expect(newToken).to.not.equal(oldToken);
    expect((await publicCard(oldToken)).status).to.equal(404);
    expect((await publicCard(newToken)).status).to.equal(200);
  });

  it("cannot regenerate a card that is not enabled", async () => {
    const res = await agent.post(`${base}/regenerate`);
    expect(res.status).to.equal(400);
  });

  it("always shows the owner name and shows conditions only when allowed", async () => {
    const token = (
      await enable({
        ownerName: "Laura Gomez",
        conditions: "Sensitive to antibiotics",
      })
    ).body.data.emergency.publicToken;
    const first = await publicCard(token);
    expect(first.body.data.ownerName).to.equal("Laura Gomez");
    expect(first.body.data).to.not.have.property("conditions");

    await agent.patch(base).send({ showConditions: true });
    const second = await publicCard(token);
    expect(second.body.data.conditions).to.equal("Sensitive to antibiotics");
  });
});
