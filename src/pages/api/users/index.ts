import admins from "@/lib/admins";
import base from "@/lib/airtable";
import { User } from "@/types/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

// GET - /api/users - Get all users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users: Partial<User>[] = [];

  const token = await getToken({ req });
  if (!token || !token.id || !admins.includes(token.id)) return res.status(401);

  try {
    await base("Users")
      .select({
        // filterByFormula:
        //   "AND(NOT({Verification Status} = 'Approved'), NOT({Verification Status} = 'Rejected'))",
      })
      .all()
      .then((records) => {
        for (const record of records)
          users.push({ ...record.fields, id: record.id } as Partial<User>);
      });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
