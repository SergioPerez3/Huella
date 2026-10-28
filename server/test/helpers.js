import request from "supertest";
import app from "../src/app.js";

export const registerUser = async (overrides = {}) => {
  const agent = request.agent(app);
  const user = {
    name: "Test",
    email: `user${Date.now()}${Math.floor(Math.random() * 1e6)}@test.com`,
    password: "123456",
    ...overrides,
  };
  const res = await agent.post("/api/v1/auth/register").send(user);
  return { agent, user, res };
};

export const createPet = async (agent, overrides = {}) => {
  const res = await agent
    .post("/api/v1/pets")
    .send({ name: "Luna", species: "dog", ...overrides });
  return res.body.data;
};
