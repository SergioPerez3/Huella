import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import { registerUser, createPet } from "./helpers.js";

const api = "/api/v1/dashboard";

describe("Dashboard", () => {
  it("requires authentication", async () => {
    expect((await request(app).get(api)).status).to.equal(401);
  });

  it("returns empty data for a new user", async () => {
    const { agent } = await registerUser();
    const { data } = (await agent.get(api)).body;
    expect(data.pets).to.have.length(0);
    expect(data.tasks.overdue).to.equal(0);
    expect(data.tasks.upcoming).to.have.length(0);
    expect(data.upcomingHealth).to.have.length(0);
    expect(data.latestWeights).to.have.length(0);
    expect(data.monthExpenses.total).to.equal(0);
  });

  it("summarizes the data of the logged user only", async () => {
    const { agent } = await registerUser();
    const pet = await createPet(agent);
    const post = (path, body) => agent.post(`/api/v1/${path}`).send(body);

    await post("tasks", {
      petId: pet._id,
      title: "Late",
      dueAt: "2020-01-01T09:00:00.000Z",
    });
    await post("tasks", {
      petId: pet._id,
      title: "Soon",
      dueAt: "2099-01-01T09:00:00.000Z",
    });
    const done = (
      await post("tasks", {
        petId: pet._id,
        title: "Done",
        dueAt: "2099-02-01T09:00:00.000Z",
      })
    ).body.data;
    await agent.post(`/api/v1/tasks/${done._id}/complete`);

    await post(`pets/${pet._id}/health`, {
      type: "vaccine",
      date: "2026-10-01",
      title: "Rabies",
      nextDueDate: "2099-10-01",
    });
    for (const [date, kg] of [
      ["2026-08-01", 22],
      ["2026-09-01", 23],
      ["2026-10-01", 24],
    ]) {
      await post(`pets/${pet._id}/weights`, { date, kg });
    }
    await post("expenses", {
      petId: pet._id,
      amount: 1000,
      category: "food",
      date: new Date().toISOString(),
    });

    const stranger = await registerUser();
    const otherPet = await createPet(stranger.agent);
    await stranger.agent
      .post("/api/v1/expenses")
      .send({
        petId: otherPet._id,
        amount: 9999,
        category: "vet",
        date: new Date().toISOString(),
      });

    const { data } = (await agent.get(api)).body;
    expect(data.pets).to.have.length(1);
    expect(data.tasks.overdue).to.equal(1);
    expect(data.tasks.upcoming).to.have.length(1);
    expect(data.tasks.upcoming[0].title).to.equal("Soon");
    expect(data.upcomingHealth).to.have.length(1);
    expect(data.latestWeights[0].weights.map((w) => w.kg)).to.deep.equal([
      24, 23,
    ]);
    expect(data.monthExpenses.total).to.equal(1000);
  });
});
