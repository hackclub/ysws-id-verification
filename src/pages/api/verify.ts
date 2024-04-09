import base from "@/lib/airtable";
import { VerificationStatus } from "@/types/user";
import type { NextApiRequest, NextApiResponse } from "next";

// POST - /api/verify - Update a user's verification status
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body as { id: string; status: VerificationStatus };

  try {
    await base("Users").update([
      {
        id: data.id,
        fields: {
          "Verification Status": data.status,
        },
      },
    ]);

    return res.status(200).json("ok");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
