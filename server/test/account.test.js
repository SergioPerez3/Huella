import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Pet from "../src/models/Pet.js";
import HealthRecord from "../src/models/HealthRecord.js";
import Weight from "../src/models/Weight.js";
import Task from "../src/models/Task.js";
import Expense from "../src/models/Expense.js";
import { registerUser, createPet } from "./helpers.js";

const api = "/api/v1/auth/me";

describe("Account", () => {
  it("requires authentication", async () => {
    expect((await request(app).patch(api).send({ name: "x" })).status).to.equal(
      401,
    );
    expect(
      (await request(app).delete(api).send({ password: "123456" })).status,
    ).to.equal(401);
  });

  it("updates name and timezone", async () => {
    const { agent } = await registerUser();
    const res = await agent
      .patch(api)
      .send({ name: "Sergio", timezone: "America/Mexico_City" });
    expect(res.status).to.equal(200);
    expect(res.body.data).to.include({
      name: "Sergio",
      timezone: "America/Mexico_City",
    });
  });

  it("rejects empty names and invalid timezones", async () => {
    const { agent } = await registerUser();
    expect((await agent.patch(api).send({ name: "" })).status).to.equal(400);
    expect(
      (await agent.patch(api).send({ timezone: "Mars/Olympus" })).status,
    ).to.equal(400);
  });

  it("ignores email and password in the update", async () => {
    const { agent, user } = await registerUser();
    await agent
      .patch(api)
      .send({ email: "hacker@test.com", password: "hacked1" });
    expect(await User.findOne({ email: user.email })).to.exist;
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: user.email, password: user.password });
    expect(login.status).to.equal(200);
  });

  it("requires the right password to delete the account", async () => {
    const { agent, user } = await registerUser();
    expect((await agent.delete(api).send({})).status).to.equal(400);
    expect(
      (await agent.delete(api).send({ password: "wrong-pass" })).status,
    ).to.equal(401);
    expect(await User.findOne({ email: user.email })).to.exist;
  });

  it("deletes the account with all its data and keeps other users untouched", async () => {
    const { agent, user } = await registerUser();
    const pet = await createPet(agent);
    await agent
      .post(`/api/v1/pets/${pet._id}/health`)
      .send({ type: "visit", date: "2026-10-01", title: "Checkup" });
    await agent
      .post(`/api/v1/pets/${pet._id}/weights`)
      .send({ date: "2026-10-01", kg: 20 });
    await agent
      .post("/api/v1/tasks")
      .send({
        petId: pet._id,
        title: "Walk",
        dueAt: "2026-10-01T09:00:00.000Z",
      });
    await agent
      .post("/api/v1/expenses")
      .send({
        petId: pet._id,
        amount: 1000,
        category: "food",
        date: "2026-10-05",
      });

    const stranger = await registerUser();
    await createPet(stranger.agent, { name: "Max" });

    const res = await agent.delete(api).send({ password: user.password });
    expect(res.status).to.equal(200);

    for (const Model of [Pet, HealthRecord, Weight, Task, Expense]) {
      expect(await Model.countDocuments({ owner: pet.owner })).to.equal(0);
    }
    expect(await User.findOne({ email: user.email })).to.equal(null);
    expect((await agent.get(api)).status).to.equal(401);
    expect(await Pet.countDocuments()).to.equal(1);
  });
});
