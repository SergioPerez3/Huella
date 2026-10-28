import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import { registerUser, createPet } from "./helpers.js";

const jpeg = Buffer.concat([
  Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
  Buffer.alloc(100),
]);
const unknownId = "64b000000000000000000000";

describe("Uploads", () => {
  let agent;
  let pet;
  let photoUrl;
  let docsUrl;

  beforeEach(async () => {
    ({ agent } = await registerUser());
    pet = await createPet(agent);
    photoUrl = `/api/v1/pets/${pet._id}/photo`;
    docsUrl = `/api/v1/pets/${pet._id}/documents`;
  });

  describe("Pet photo", () => {
    it("requires authentication", async () => {
      const res = await request(app).post(photoUrl);
      expect(res.status).to.equal(401);
    });

    it("rejects a request without file", async () => {
      const res = await agent.post(photoUrl);
      expect(res.status).to.equal(400);
    });

    it("rejects a file type that is not an image", async () => {
      const res = await agent
        .post(photoUrl)
        .attach("photo", Buffer.from("hello"), {
          filename: "a.txt",
          contentType: "text/plain",
        });
      expect(res.status).to.equal(400);
    });

    it("rejects a fake image (wrong file signature)", async () => {
      const res = await agent
        .post(photoUrl)
        .attach("photo", Buffer.from("this is not an image"), {
          filename: "a.jpg",
          contentType: "image/jpeg",
        });
      expect(res.status).to.equal(400);
    });

    it("rejects files larger than 5 MB", async () => {
      const big = Buffer.concat([jpeg, Buffer.alloc(6 * 1024 * 1024)]);
      const res = await agent
        .post(photoUrl)
        .attach("photo", big, {
          filename: "big.jpg",
          contentType: "image/jpeg",
        });
      expect(res.status).to.equal(400);
    });

    it("blocks other users before reading the file", async () => {
      const stranger = await registerUser();
      const res = await stranger.agent
        .post(photoUrl)
        .attach("photo", jpeg, {
          filename: "a.jpg",
          contentType: "image/jpeg",
        });
      expect(res.status).to.equal(404);
    });

    it("returns 404 when deleting a photo that does not exist", async () => {
      const res = await agent.delete(photoUrl);
      expect(res.status).to.equal(404);
    });
  });

  describe("Documents", () => {
    it("lists an empty array at first", async () => {
      const res = await agent.get(docsUrl);
      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.length(0);
    });

    it("rejects a request without file and a fake PDF", async () => {
      expect((await agent.post(docsUrl)).status).to.equal(400);
      const res = await agent
        .post(docsUrl)
        .attach("file", Buffer.from("not a pdf"), {
          filename: "a.pdf",
          contentType: "application/pdf",
        });
      expect(res.status).to.equal(400);
    });

    it("rejects a recordId that does not belong to the pet", async () => {
      const res = await agent
        .post(docsUrl)
        .field("recordId", unknownId)
        .attach("file", jpeg, { filename: "a.jpg", contentType: "image/jpeg" });
      expect(res.status).to.equal(404);
    });

    it("returns 404 for unknown documents", async () => {
      expect((await agent.delete(`${docsUrl}/${unknownId}`)).status).to.equal(
        404,
      );
      expect((await agent.delete(`${docsUrl}/not-an-id`)).status).to.equal(404);
    });

    it("blocks other users", async () => {
      const stranger = await registerUser();
      expect((await stranger.agent.get(docsUrl)).status).to.equal(404);
    });
  });
});
