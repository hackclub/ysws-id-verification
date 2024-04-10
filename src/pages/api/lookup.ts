import admins from "@/lib/admins";
import base from "@/lib/airtable";
import type { NextApiRequest, NextApiResponse } from "next";

// POST - /api/lookup - Lookup verification status for a user
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const userId = body.text.split("|")[0].slice(2);
  if (!userId) return res.status(400).json({ message: "Invalid user" });

  if (!admins.includes(body.user_id)) return res.status(401).json({ message: "Unauthorized" });

  try {
    const record = await base("Users")
      .select({ filterByFormula: `{Hack Club Slack ID} = '${userId}'` })
      .firstPage();

    if (record.length > 0) {
      return res
        .status(200)
        .json(`Verification Status for <@${userId}>: ${record[0].fields["Verification Status"]}`);
    } else {
      return res
        .status(200)
        .json(
          `User <@${userId}> not verified. Ask them to head over to https://verify.hackclub.dev to get verified.`
        );
    }
  } catch (error: any) {
    console.error(error);
    return res.status(200).json(error.message);
  }
}
