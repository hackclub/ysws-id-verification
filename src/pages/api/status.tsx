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
    const records = await base("Users")
      .select({
        filterByFormula: `OR({Email} = '${data.email}', {Hack Club Slack ID} = '${data.slack_id}')`,
        sort: [{ field: "Created At", direction: "desc" }],
      })
      .all();

    if (records.length > 0) {
      return res.status(200).json({
        status: records[0].fields["Verification Status"],
        reason: records[0].fields["Reason (Sent in email)"],
      });
    } else {
      return res.status(200).json(`User ${data.email || data.slack_id} not found!`);
    }
  } catch (error: any) {
    console.error(error);
    return res.status(200).json({message: error.message, ...error });
  }
}

export default handler;
