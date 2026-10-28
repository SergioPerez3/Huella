import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

before(async () => {
  if (!process.env.MONGO_URI_TEST)
    throw new Error("MONGO_URI_TEST is not defined");
  await mongoose.connect(process.env.MONGO_URI_TEST);
  if (!mongoose.connection.name.includes("test")) {
    await mongoose.disconnect();
    throw new Error(
      'Refusing to run tests on a database without "test" in its name',
    );
  }
});

beforeEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map((c) => c.deleteMany({})),
  );
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
