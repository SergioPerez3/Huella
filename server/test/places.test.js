import { expect } from "chai";
import {
  haversineKm,
  normalize,
  findPlaces,
} from "../src/services/placesService.js";

const madrid = { lat: 40.4168, lng: -3.7038 };

describe("placesService", () => {
  describe("haversineKm", () => {
    it("calcula la distancia entre dos puntos", () => {
      const km = haversineKm(madrid, { lat: 40.4168, lng: -3.6038 });
      expect(km).to.be.within(8, 9);
    });
  });

  describe("normalize", () => {
    const vet = {
      type: "node",
      id: 1,
      lat: 40.42,
      lon: -3.7,
      tags: {
        amenity: "veterinary",
        name: "Clínica Test",
        "addr:street": "Calle Mayor",
        "addr:housenumber": "1",
        phone: "910000000;911111111",
      },
    };

    it("convierte un veterinario de OpenStreetMap", () => {
      const place = normalize(vet, madrid);
      expect(place.category).to.equal("veterinarios");
      expect(place.address).to.equal("Calle Mayor 1");
      expect(place.phone).to.equal("910000000");
      expect(place.distanceKm).to.be.a("number");
    });

    it("descarta lugares sin nombre o de otro tipo", () => {
      expect(
        normalize({ ...vet, tags: { amenity: "veterinary" } }, madrid),
      ).to.equal(null);
      expect(
        normalize({ ...vet, tags: { amenity: "bank", name: "Banco" } }, madrid),
      ).to.equal(null);
    });

    it("descarta webs que no sean http(s)", () => {
      const place = normalize(
        { ...vet, tags: { ...vet.tags, website: "javascript:alert(1)" } },
        madrid,
      );
      expect(place.website).to.equal(null);
    });
  });

  describe("findPlaces", () => {
    const original = globalThis.fetch;
    afterEach(() => {
      globalThis.fetch = original;
    });

    it("ordena por distancia y cuenta por categoría", async () => {
      const origin = { lat: 38.1, lng: -1.1 };
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          elements: [
            {
              type: "node",
              id: 1,
              lat: 38.2,
              lon: -1.1,
              tags: { amenity: "veterinary", name: "Lejos" },
            },
            {
              type: "node",
              id: 2,
              lat: 38.101,
              lon: -1.1,
              tags: { shop: "pet_grooming", name: "Cerca" },
            },
          ],
        }),
      });
      const { places, counts, total } = await findPlaces(origin, 30);
      expect(places.map((p) => p.name)).to.deep.equal(["Cerca", "Lejos"]);
      expect(counts.veterinarios).to.equal(1);
      expect(counts.peluquerias).to.equal(1);
      expect(total).to.equal(2);
    });

    it("lanza un error 502 si el servicio de mapas falla", async () => {
      globalThis.fetch = async () => ({ ok: false, status: 504 });
      try {
        await findPlaces({ lat: 37.1, lng: -2.1 }, 30);
        expect.fail("debería haber lanzado");
      } catch (err) {
        expect(err.status).to.equal(502);
      }
    });
  });
});
