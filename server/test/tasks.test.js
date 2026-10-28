import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import Task from "../src/models/Task.js";
import { registerUser, createPet } from "./helpers.js";

const api = "/api/v1/tasks";

describe("Tasks", () => {
  let agent;
  let pet;
  let task;

  beforeEach(async () => {
    ({ agent } = await registerUser());
    pet = await createPet(agent);
    task = {
      petId: pet._id,
      title: "Morning walk",
      type: "walk",
      dueAt: "2026-10-01T09:00:00.000Z",
    };
  });

  it("requires authentication", async () => {
    const res = await request(app).get(api);
    expect(res.status).to.equal(401);
  });

  it("creates a pending task", async () => {
    const res = await agent.post(api).send(task);
    expect(res.status).to.equal(201);
    expect(res.body.data.status).to.equal("pending");
  });

  it("rejects missing title, missing date and invalid type", async () => {
    expect(
      (await agent.post(api).send({ ...task, title: undefined })).status,
    ).to.equal(400);
    expect(
      (await agent.post(api).send({ ...task, dueAt: undefined })).status,
    ).to.equal(400);
    expect(
      (await agent.post(api).send({ ...task, type: "dance" })).status,
    ).to.equal(400);
  });

  it("rejects pets of other users and invalid pet ids", async () => {
    const stranger = await registerUser();
    expect((await stranger.agent.post(api).send(task)).status).to.equal(404);
    expect(
      (await agent.post(api).send({ ...task, petId: "abc" })).status,
    ).to.equal(404);
  });

  it("lists own tasks only, with status and date filters", async () => {
    await agent.post(api).send(task);
    await agent.post(api).send({ ...task, dueAt: "2026-11-01T09:00:00.000Z" });
    const stranger = await registerUser();
    const otherPet = await createPet(stranger.agent);
    await stranger.agent.post(api).send({ ...task, petId: otherPet._id });

    expect((await agent.get(api)).body.data).to.have.length(2);
    expect(
      (await agent.get(`${api}?from=2026-10-15`)).body.data,
    ).to.have.length(1);
    expect((await agent.get(`${api}?status=done`)).body.data).to.have.length(0);
    expect((await agent.get(`${api}?from=abc`)).status).to.equal(400);
  });

  it("updates a task but ignores status changes", async () => {
    const created = (await agent.post(api).send(task)).body.data;
    const res = await agent
      .patch(`${api}/${created._id}`)
      .send({ title: "Evening walk", status: "done" });
    expect(res.body.data.title).to.equal("Evening walk");
    expect(res.body.data.status).to.equal("pending");
  });

  it("completes a task without recurrence", async () => {
    const created = (await agent.post(api).send(task)).body.data;
    const res = await agent.post(`${api}/${created._id}/complete`);
    expect(res.status).to.equal(200);
    expect(res.body.data.task.status).to.equal("done");
    expect(res.body.data.task.completedAt).to.exist;
    expect(res.body.data.next).to.equal(null);
  });

  it("creates the next occurrence of a weekly task", async () => {
    const created = (
      await agent
        .post(api)
        .send({ ...task, recurrence: { frequency: "weekly" } })
    ).body.data;
    const res = await agent.post(`${api}/${created._id}/complete`);
    expect(res.body.data.next.status).to.equal("pending");
    expect(res.body.data.next.dueAt).to.equal("2026-10-08T09:00:00.000Z");
    expect(await Task.countDocuments({ petId: pet._id })).to.equal(2);
  });

  it('stops the recurrence after the "until" date', async () => {
    const recurrence = {
      frequency: "daily",
      until: "2026-10-01T12:00:00.000Z",
    };
    const created = (await agent.post(api).send({ ...task, recurrence })).body
      .data;
    const res = await agent.post(`${api}/${created._id}/complete`);
    expect(res.body.data.next).to.equal(null);
  });

  it("skips a task and cannot close it twice", async () => {
    const created = (await agent.post(api).send(task)).body.data;
    const skipped = await agent.post(`${api}/${created._id}/skip`);
    expect(skipped.body.data.task.status).to.equal("skipped");
    expect(
      (await agent.post(`${api}/${created._id}/complete`)).status,
    ).to.equal(409);
  });

  it("blocks other users and invalid ids", async () => {
    const created = (await agent.post(api).send(task)).body.data;
    const stranger = await registerUser();
    expect(
      (await stranger.agent.patch(`${api}/${created._id}`).send({ title: "x" }))
        .status,
    ).to.equal(404);
    expect(
      (await stranger.agent.post(`${api}/${created._id}/complete`)).status,
    ).to.equal(404);
    expect(
      (await stranger.agent.delete(`${api}/${created._id}`)).status,
    ).to.equal(404);
    expect((await agent.delete(`${api}/not-an-id`)).status).to.equal(404);
  });

  it("deletes a task", async () => {
    const created = (await agent.post(api).send(task)).body.data;
    expect((await agent.delete(`${api}/${created._id}`)).status).to.equal(200);
    expect((await agent.delete(`${api}/${created._id}`)).status).to.equal(404);
  });

  it("is deleted together with its pet", async () => {
    await agent.post(api).send(task);
    await agent.delete(`/api/v1/pets/${pet._id}`);
    expect(await Task.countDocuments({ petId: pet._id })).to.equal(0);
  });
});
