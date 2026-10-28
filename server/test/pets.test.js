import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import HealthRecord from "../src/models/HealthRecord.js";
import Weight from "../src/models/Weight.js";
import { registerUser, createPet } from "./helpers.js";

const api = "/api/v1/pets";

describe("Pets", () => {
  it("requires authentication", async () => {
    const res = await request(app).get(api);
    expect(res.status).to.equal(401);
  });

  it("creates a pet owned by the logged user, ignoring the owner sent in the body", async () => {
    const { agent, res: reg } = await registerUser();
    const res = await agent
      .post(api)
      .send({
        name: "Luna",
        species: "dog",
        owner: "64b000000000000000000000",
      });
    expect(res.status).to.equal(201);
    expect(res.body.data.owner).to.equal(reg.body.data.id);
  });

  it("rejects a missing name and an invalid species", async () => {
    const { agent } = await registerUser();
    expect((await agent.post(api).send({ species: "dog" })).status).to.equal(
      400,
    );
    expect(
      (await agent.post(api).send({ name: "Luna", species: "dragon" })).status,
    ).to.equal(400);
  });

  it("lists only the pets of the logged user", async () => {
    const a = await registerUser();
    const b = await registerUser();
    await createPet(a.agent);
    await createPet(b.agent, { name: "Max" });
    const res = await a.agent.get(api);
    expect(res.body.data).to.have.length(1);
    expect(res.body.data[0].name).to.equal("Luna");
  });

  it("returns 404 for pets of other users and for invalid ids", async () => {
    const a = await registerUser();
    const b = await registerUser();
    const pet = await createPet(a.agent);
    expect((await b.agent.get(`${api}/${pet._id}`)).status).to.equal(404);
    expect(
      (await b.agent.patch(`${api}/${pet._id}`).send({ name: "x" })).status,
    ).to.equal(404);
    expect((await b.agent.delete(`${api}/${pet._id}`)).status).to.equal(404);
    expect((await a.agent.get(`${api}/not-an-id`)).status).to.equal(404);
  });

  it("updates a pet", async () => {
    const { agent } = await registerUser();
    const pet = await createPet(agent);
    const res = await agent
      .patch(`${api}/${pet._id}`)
      .send({ notes: "Likes running" });
    expect(res.status).to.equal(200);
    expect(res.body.data.notes).to.equal("Likes running");
  });

  it("deletes a pet together with its health records and weights", async () => {
    const { agent } = await registerUser();
    const pet = await createPet(agent);
    await agent
      .post(`${api}/${pet._id}/health`)
      .send({ type: "visit", date: "2026-10-01", title: "Checkup" });
    await agent
      .post(`${api}/${pet._id}/weights`)
      .send({ date: "2026-10-01", kg: 20 });
    const res = await agent.delete(`${api}/${pet._id}`);
    expect(res.status).to.equal(200);
    expect(await HealthRecord.countDocuments({ petId: pet._id })).to.equal(0);
    expect(await Weight.countDocuments({ petId: pet._id })).to.equal(0);
  });
});
