import admins from "@/lib/admins";
import base from "@/lib/airtable";
import { User } from "@/types/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const token = await getToken({ req });
  if (!token || !token.id || !admins.includes(token.id)) return res.status(401);

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
