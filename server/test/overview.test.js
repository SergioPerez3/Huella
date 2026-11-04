import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import { registerUser, createPet } from "./helpers.js";

describe("Overview (all pets)", () => {
  let agent;
  let luna;
  let roco;

  beforeEach(async () => {
    ({ agent } = await registerUser());
    luna = await createPet(agent, { name: "Luna" });
    roco = await createPet(agent, { name: "Roco" });
    await agent
      .post(`/api/v1/pets/${luna._id}/health`)
      .send({ type: "visit", date: "2026-01-10", title: "Check-up" });
    await agent
      .post(`/api/v1/pets/${roco._id}/health`)
      .send({ type: "vaccine", date: "2026-02-10", title: "Rabies" });
  });

  it("lists the records of all my pets, newest first", async () => {
    const res = await agent.get("/api/v1/health-records");
    expect(res.status).to.equal(200);
    expect(res.body.data).to.have.length(2);
    expect(res.body.data[0].title).to.equal("Rabies");
  });

  it("filters by pet", async () => {
    const res = await agent.get(`/api/v1/health-records?petId=${luna._id}`);
    expect(res.body.data).to.have.length(1);
    expect(res.body.data[0].title).to.equal("Check-up");
  });

  it("does not leak records of other users", async () => {
    const { agent: other } = await registerUser();
    const res = await other.get("/api/v1/health-records");
    expect(res.status).to.equal(200);
    expect(res.body.data).to.have.length(0);
  });

  it("rejects an invalid petId", async () => {
    const res = await agent.get("/api/v1/health-records?petId=abc");
    expect(res.status).to.equal(400);
  });

  it("lists documents (empty at first)", async () => {
    const res = await agent.get("/api/v1/documents");
    expect(res.status).to.equal(200);
    expect(res.body.data).to.have.length(0);
  });

  it("requires authentication", async () => {
    expect((await request(app).get("/api/v1/health-records")).status).to.equal(
      401,
    );
    expect((await request(app).get("/api/v1/documents")).status).to.equal(401);
  });
});
