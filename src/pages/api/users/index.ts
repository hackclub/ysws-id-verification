import base from "@/lib/airtable";
import { User } from "@/types/user";
import type { NextApiRequest, NextApiResponse } from "next";

// GET - /api/users - Get users that are pending verification
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users: Partial<User>[] = [];

  try {
    await base("Users")
      .select({
        filterByFormula:
          "AND(NOT({Verification Status} = 'Approved'), NOT({Verification Status} = 'Rejected'))",
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
