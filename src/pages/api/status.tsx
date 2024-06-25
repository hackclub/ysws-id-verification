// Check verification status for an email or a slack id in the Airtable Users table
import base from "@/lib/airtable";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as {
    email?: string;
    slack_id?: string;
  };

  if (!data.email && !data.slack_id) return res.status(400).json({ message: "Invalid user" });

  try {
    const record = await base("Users")
      .select({
        filterByFormula: `OR({Email} = '${data.email}', {Hack Club Slack ID} = '${data.slack_id}')`,
      })
      .firstPage();

    if (record.length > 0) {
      return res
        .status(200)
        .json(
          `Verification Status for ${data.email || data.slack_id}: ${
            record[0].fields["Verification Status"]
          }`
        );
    } else {
      return res.status(200).json(`User ${data.email || data.slack_id} not found!`);
    }
  } catch (error: any) {
    console.error(error);
    return res.status(200).json(error.message);
  }
}

export default handler;
