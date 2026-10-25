import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;

if (!uri) {
  throw new Error("DATABASE_URL is missing from .env.local");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
});

export async function checkDBConnection() {
  await client.connect();

  await client.db().command({ ping: 1 });

  console.log("✅ MongoDB connected successfully!");

  await client.close();
}