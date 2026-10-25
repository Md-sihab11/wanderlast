import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const uri = process.env.MONGO_URL;

  if (!uri) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is missing" },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    await client.db().command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    return NextResponse.json(
      { success: false, message: "MongoDB connection failed" },
      { status: 500 }
    );
  } finally {
    await client.close().catch(() => {});
  }
}