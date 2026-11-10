import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Cuenta demo", () => {
  it("crea una cuenta demo con datos de ejemplo y sesión", async () => {
    const agent = request.agent(app);
    const res = await agent.post("/api/v1/auth/demo");
    expect(res.status).to.equal(201);
    expect(res.body.data.isDemo).to.equal(true);

    const pets = await agent.get("/api/v1/pets");
    expect(pets.status).to.equal(200);
    expect(pets.body.data).to.have.lengthOf(2);

    const tasks = await agent.get("/api/v1/tasks");
    expect(tasks.body.data.length).to.be.greaterThan(5);
  });

  it("cada visitante recibe una cuenta distinta", async () => {
    const a = await request(app).post("/api/v1/auth/demo");
    const b = await request(app).post("/api/v1/auth/demo");
    expect(a.body.data.id).to.not.equal(b.body.data.id);
  });
});
