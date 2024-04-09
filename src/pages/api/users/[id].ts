import base from "@/lib/airtable";
import { User } from "@/types/user";
import type { NextApiRequest, NextApiResponse } from "next";

// GET - /api/users/[id] - Get a user by ID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const record = await base("Users").find(id);

    if (!record) {
      return res.status(404).json({ message: "User not found" });
    }

    const user: Partial<User> = { ...record.fields, id: record.id };

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
