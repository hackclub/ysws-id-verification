import admins from "@/lib/admins";
import base from "@/lib/airtable";
import type { NextApiRequest, NextApiResponse } from "next";
import { WebClient } from "@slack/web-api";

const web = new WebClient(process.env.SLACK_BOT_TOKEN as string);

// POST - /api/vouch - Vouch a user
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;
  const [email, ...reason] = data.text.split(" ") as string[];

  if (!email || !reason.length)
    return res.status(200).json("Request must be in the format `/vouch <email> <reason>`");
  if (!admins.includes(data.user_id)) return res.status(401).json({ message: "Unauthorized" });

  try {
    const record = await base("Users")
      .select({ filterByFormula: `{Email} = '${email}'` })
      .firstPage();

    if (record.length === 0) {
      await base("Users").create([
        {
          fields: {
            Email: email,
            "Verification Status": "Vouched For",
            "Vouched By": [data.user_name],
            Reason: reason.join(" "),
          },
        },
      ]);
    } else {
      const vouchedBy = [...((record[0].fields["Vouched By"] as string[]) || []), data.user_name];
      await base("Users").update(
        [
          {
            id: record[0].id,
            fields: {
              "Vouched By": Array.from(new Set(vouchedBy)),
              "Verification Status": "Vouched For",
              Reason: reason.join(" "),
            },
          },
        ],
        { typecast: true }
      );
    }

    return res.status(200).json("Vouched successfully!");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
