import { expect } from "chai";
import { registerUser, createPet } from "./helpers.js";

const url = (pet) => `/api/v1/pets/${pet._id}/weights`;

describe("Weights", () => {
  let agent;
  let pet;

  beforeEach(async () => {
    ({ agent } = await registerUser());
    pet = await createPet(agent);
  });

  it("creates a weight", async () => {
    const res = await agent
      .post(url(pet))
      .send({ date: "2026-10-01", kg: 24.5 });
    expect(res.status).to.equal(201);
    expect(res.body.data.kg).to.equal(24.5);
  });

  it("rejects negative or missing values", async () => {
    expect(
      (await agent.post(url(pet)).send({ date: "2026-10-01", kg: -3 })).status,
    ).to.equal(400);
    expect(
      (await agent.post(url(pet)).send({ date: "2026-10-01" })).status,
    ).to.equal(400);
    expect((await agent.post(url(pet)).send({ kg: 20 })).status).to.equal(400);
  });

  it("lists weights from oldest to newest", async () => {
    await agent.post(url(pet)).send({ date: "2026-10-01", kg: 25 });
    await agent.post(url(pet)).send({ date: "2026-09-01", kg: 24 });
    const res = await agent.get(url(pet));
    expect(res.body.data.map((w) => w.kg)).to.deep.equal([24, 25]);
  });

  it("rejects an invalid date filter", async () => {
    expect((await agent.get(`${url(pet)}?from=abc`)).status).to.equal(400);
  });

  it("updates and deletes a weight", async () => {
    const created = (
      await agent.post(url(pet)).send({ date: "2026-10-01", kg: 24 })
    ).body.data;
    const updated = await agent
      .patch(`${url(pet)}/${created._id}`)
      .send({ kg: 25 });
    expect(updated.body.data.kg).to.equal(25);
    expect((await agent.delete(`${url(pet)}/${created._id}`)).status).to.equal(
      200,
    );
    expect((await agent.delete(`${url(pet)}/${created._id}`)).status).to.equal(
      404,
    );
  });

  it("blocks other users", async () => {
    const stranger = await registerUser();
    expect((await stranger.agent.get(url(pet))).status).to.equal(404);
    expect(
      (await stranger.agent.post(url(pet)).send({ date: "2026-10-01", kg: 20 }))
        .status,
    ).to.equal(404);
  });
});
