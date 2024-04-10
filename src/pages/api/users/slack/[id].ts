import admins from "@/lib/admins";
import base from "@/lib/airtable";
import { User } from "@/types/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

// GET - /api/users/slack/[id] - Get a user by slack ID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const token = await getToken({ req });
  if (!token || !token.id || !admins.includes(token.id)) return res.status(401);

  try {
    const record = await base("Users")
      .select({ filterByFormula: `{Hack Club Slack ID} = '${id}'` })
      .firstPage();

    if (!record.length) {
      return res.status(200).json(null);
    }

    const user: Partial<User> = { ...record[0].fields, id: record[0].id };

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
