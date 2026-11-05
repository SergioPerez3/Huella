import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import { registerUser } from "./helpers.js";

const api = "/api/v1/auth/me";

describe("Avatar", () => {
  it("sets a preset avatar", async () => {
    const { agent } = await registerUser();
    const res = await agent.patch(api).send({ avatarPreset: "p3" });
    expect(res.status).to.equal(200);
    expect(res.body.data.avatar).to.deep.equal({ preset: "p3", url: null });
  });

  it("rejects unknown presets", async () => {
    const { agent } = await registerUser();
    expect(
      (await agent.patch(api).send({ avatarPreset: "hacker" })).status,
    ).to.equal(400);
  });

  it("clears the preset with null", async () => {
    const { agent } = await registerUser();
    await agent.patch(api).send({ avatarPreset: "p2" });
    const res = await agent.patch(api).send({ avatarPreset: null });
    expect(res.body.data.avatar.preset).to.equal(null);
  });

  it("removes the avatar", async () => {
    const { agent } = await registerUser();
    await agent.patch(api).send({ avatarPreset: "p5" });
    const res = await agent.delete(`${api}/avatar`);
    expect(res.status).to.equal(200);
    expect(res.body.data.avatar).to.deep.equal({ preset: null, url: null });
  });

  it("requires authentication and a file for uploads", async () => {
    expect((await request(app).post(`${api}/avatar`)).status).to.equal(401);
    expect((await request(app).delete(`${api}/avatar`)).status).to.equal(401);
    const { agent } = await registerUser();
    expect((await agent.post(`${api}/avatar`)).status).to.equal(400);
  });
});
