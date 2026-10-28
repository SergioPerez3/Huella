import { expect } from "chai";
import { registerUser, createPet } from "./helpers.js";

const record = { type: "vaccine", date: "2026-10-01", title: "Rabies" };
const url = (pet) => `/api/v1/pets/${pet._id}/health`;
const unknownId = "64b000000000000000000000";

describe("Health records", () => {
  let agent;
  let pet;

  beforeEach(async () => {
    ({ agent } = await registerUser());
    pet = await createPet(agent);
  });

  it("creates a record and ignores petId sent in the body", async () => {
    const res = await agent
      .post(url(pet))
      .send({ ...record, petId: unknownId });
    expect(res.status).to.equal(201);
    expect(res.body.data.petId).to.equal(pet._id);
  });

  it("rejects an invalid type and a missing title", async () => {
    expect(
      (await agent.post(url(pet)).send({ ...record, type: "other" })).status,
    ).to.equal(400);
    expect(
      (await agent.post(url(pet)).send({ type: "visit", date: "2026-10-01" }))
        .status,
    ).to.equal(400);
  });

  it("lists records newest first with pagination", async () => {
    await agent
      .post(url(pet))
      .send({ ...record, title: "Old", date: "2026-01-01" });
    await agent
      .post(url(pet))
      .send({ ...record, title: "New", date: "2026-10-01" });
    const res = await agent.get(`${url(pet)}?limit=1`);
    expect(res.body.data).to.have.length(1);
    expect(res.body.data[0].title).to.equal("New");
    expect(res.body.meta.total).to.equal(2);
  });

  it("filters by type", async () => {
    await agent.post(url(pet)).send(record);
    await agent
      .post(url(pet))
      .send({ type: "visit", date: "2026-09-01", title: "Checkup" });
    const res = await agent.get(`${url(pet)}?type=vaccine`);
    expect(res.body.data).to.have.length(1);
  });

  it("rejects an invalid date filter", async () => {
    const res = await agent.get(`${url(pet)}?from=abc`);
    expect(res.status).to.equal(400);
  });

  it("updates and deletes a record", async () => {
    const created = (await agent.post(url(pet)).send(record)).body.data;
    const updated = await agent
      .patch(`${url(pet)}/${created._id}`)
      .send({ notes: "No reaction" });
    expect(updated.status).to.equal(200);
    expect(updated.body.data.notes).to.equal("No reaction");
    expect((await agent.delete(`${url(pet)}/${created._id}`)).status).to.equal(
      200,
    );
    expect((await agent.delete(`${url(pet)}/${created._id}`)).status).to.equal(
      404,
    );
  });

  it("returns 404 for unknown or invalid record ids", async () => {
    expect(
      (await agent.patch(`${url(pet)}/${unknownId}`).send({ notes: "x" }))
        .status,
    ).to.equal(404);
    expect(
      (await agent.patch(`${url(pet)}/not-an-id`).send({ notes: "x" })).status,
    ).to.equal(404);
  });

  it("does not reach a record through another pet of the same user", async () => {
    const created = (await agent.post(url(pet)).send(record)).body.data;
    const other = await createPet(agent, { name: "Max" });
    const res = await agent
      .patch(`${url(other)}/${created._id}`)
      .send({ notes: "x" });
    expect(res.status).to.equal(404);
  });

  it("blocks other users", async () => {
    const stranger = await registerUser();
    expect((await stranger.agent.get(url(pet))).status).to.equal(404);
    expect((await stranger.agent.post(url(pet)).send(record)).status).to.equal(
      404,
    );
  });
});
