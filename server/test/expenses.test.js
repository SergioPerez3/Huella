import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import Expense from "../src/models/Expense.js";
import { registerUser, createPet } from "./helpers.js";

const api = "/api/v1/expenses";

describe("Expenses", () => {
  let agent;
  let pet;
  let expense;

  beforeEach(async () => {
    ({ agent } = await registerUser());
    pet = await createPet(agent);
    expense = {
      petId: pet._id,
      amount: 1250,
      category: "food",
      date: "2026-10-05",
    };
  });

  it("requires authentication", async () => {
    expect((await request(app).get(api)).status).to.equal(401);
  });

  it("creates an expense", async () => {
    const res = await agent.post(api).send(expense);
    expect(res.status).to.equal(201);
    expect(res.body.data.amount).to.equal(1250);
  });

  it("rejects decimals, negatives, invalid categories and missing fields", async () => {
    expect(
      (await agent.post(api).send({ ...expense, amount: 12.5 })).status,
    ).to.equal(400);
    expect(
      (await agent.post(api).send({ ...expense, amount: -1 })).status,
    ).to.equal(400);
    expect(
      (await agent.post(api).send({ ...expense, category: "cars" })).status,
    ).to.equal(400);
    expect(
      (await agent.post(api).send({ ...expense, date: undefined })).status,
    ).to.equal(400);
  });

  it("rejects pets of other users", async () => {
    const stranger = await registerUser();
    expect((await stranger.agent.post(api).send(expense)).status).to.equal(404);
  });

  it("lists with filters and pagination", async () => {
    await agent.post(api).send(expense);
    await agent
      .post(api)
      .send({ ...expense, category: "vet", amount: 5000, date: "2026-10-10" });
    await agent.post(api).send({ ...expense, date: "2026-09-01" });

    const all = await agent.get(`${api}?limit=2`);
    expect(all.body.data).to.have.length(2);
    expect(all.body.meta.total).to.equal(3);
    expect((await agent.get(`${api}?category=vet`)).body.data).to.have.length(
      1,
    );
    expect(
      (await agent.get(`${api}?from=2026-10-01`)).body.data,
    ).to.have.length(2);
    expect((await agent.get(`${api}?from=abc`)).status).to.equal(400);
  });

  it("summarizes a month by category", async () => {
    await agent.post(api).send(expense);
    await agent
      .post(api)
      .send({ ...expense, category: "vet", amount: 5000, date: "2026-10-10" });
    await agent.post(api).send({ ...expense, amount: 500, date: "2026-09-30" });

    const res = await agent.get(`${api}/summary?month=2026-10`);
    expect(res.status).to.equal(200);
    expect(res.body.data.total).to.equal(6250);
    expect(res.body.data.count).to.equal(2);
    expect(res.body.data.byCategory[0]).to.include({
      category: "vet",
      total: 5000,
    });
  });

  it("summary only counts the logged user and validates the month", async () => {
    const stranger = await registerUser();
    const otherPet = await createPet(stranger.agent);
    await stranger.agent.post(api).send({ ...expense, petId: otherPet._id });

    expect(
      (await agent.get(`${api}/summary?month=2026-10`)).body.data.total,
    ).to.equal(0);
    expect((await agent.get(`${api}/summary`)).status).to.equal(400);
    expect((await agent.get(`${api}/summary?month=2026-13`)).status).to.equal(
      400,
    );
    expect(
      (await agent.get(`${api}/summary?month=2026-10&petId=abc`)).status,
    ).to.equal(400);
  });

  it("updates and deletes an expense", async () => {
    const created = (await agent.post(api).send(expense)).body.data;
    const updated = await agent
      .patch(`${api}/${created._id}`)
      .send({ amount: 2000 });
    expect(updated.body.data.amount).to.equal(2000);
    expect((await agent.delete(`${api}/${created._id}`)).status).to.equal(200);
    expect((await agent.delete(`${api}/${created._id}`)).status).to.equal(404);
  });

  it("blocks other users and invalid ids", async () => {
    const created = (await agent.post(api).send(expense)).body.data;
    const stranger = await registerUser();
    expect(
      (await stranger.agent.patch(`${api}/${created._id}`).send({ amount: 1 }))
        .status,
    ).to.equal(404);
    expect(
      (await stranger.agent.delete(`${api}/${created._id}`)).status,
    ).to.equal(404);
    expect(
      (await agent.patch(`${api}/not-an-id`).send({ amount: 1 })).status,
    ).to.equal(404);
  });

  it("is deleted together with its pet", async () => {
    await agent.post(api).send(expense);
    await agent.delete(`/api/v1/pets/${pet._id}`);
    expect(await Expense.countDocuments({ petId: pet._id })).to.equal(0);
  });
});
