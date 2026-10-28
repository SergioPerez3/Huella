import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import { registerUser } from "./helpers.js";

const api = "/api/v1/auth";

describe("Auth", () => {
  describe("POST /register", () => {
    it("creates a user and sets the session cookie", async () => {
      const { res } = await registerUser();
      expect(res.status).to.equal(201);
      expect(res.headers["set-cookie"]).to.exist;
      expect(res.body.data).to.not.have.property("password");
    });

    it("rejects missing fields", async () => {
      const res = await request(app)
        .post(`${api}/register`)
        .send({ email: "a@test.com" });
      expect(res.status).to.equal(400);
    });

    it("rejects short passwords", async () => {
      const { res } = await registerUser({ password: "123" });
      expect(res.status).to.equal(400);
    });

    it("rejects duplicated emails", async () => {
      const { user } = await registerUser();
      const { res } = await registerUser({ email: user.email });
      expect(res.status).to.equal(409);
    });
  });

  describe("POST /login", () => {
    it("logs in with valid credentials", async () => {
      const { user } = await registerUser();
      const res = await request(app)
        .post(`${api}/login`)
        .send({ email: user.email, password: user.password });
      expect(res.status).to.equal(200);
    });

    it("rejects a wrong password", async () => {
      const { user } = await registerUser();
      const res = await request(app)
        .post(`${api}/login`)
        .send({ email: user.email, password: "wrong-pass" });
      expect(res.status).to.equal(401);
    });

    it("rejects missing fields", async () => {
      const res = await request(app).post(`${api}/login`).send({});
      expect(res.status).to.equal(400);
    });
  });

  describe("GET /me and POST /logout", () => {
    it("blocks access without a session", async () => {
      const res = await request(app).get(`${api}/me`);
      expect(res.status).to.equal(401);
    });

    it("returns the current user", async () => {
      const { agent, user } = await registerUser();
      const res = await agent.get(`${api}/me`);
      expect(res.status).to.equal(200);
      expect(res.body.data.email).to.equal(user.email);
    });

    it("closes the session on logout", async () => {
      const { agent } = await registerUser();
      await agent.post(`${api}/logout`);
      const res = await agent.get(`${api}/me`);
      expect(res.status).to.equal(401);
    });
  });
});
