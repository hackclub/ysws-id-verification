import admins from "@/lib/admins";
import base from "@/lib/airtable";
import { withMiddleware } from "@/lib/middleware";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;
  const email = data.text;
  if (!email) return res.status(400).json({ message: "Invalid user" });

  if (!admins.includes(data.user_id)) return res.status(401).json({ message: "Unauthorized" });

  try {
    const record = await base("Users")
      .select({ filterByFormula: `{Email} = '${email}'` })
      .firstPage();

    if (record.length > 0) {
      return res
        .status(200)
        .json(`Verification Status for ${email}: ${record[0].fields["Verification Status"]}`);
    } else {
      return res
        .status(200)
        .json(
          `User ${email} not found or not verified. Ask them to head over to https://verify.hackclub.dev to get verified.`
        );
    }
  } catch (error: any) {
    console.error(error);
    return res.status(200).json(error.message);
  }
}

export default withMiddleware("slack")(handler);
