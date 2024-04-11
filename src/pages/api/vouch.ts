import admins from "@/lib/admins";
import base from "@/lib/airtable";
import type { NextApiRequest, NextApiResponse } from "next";
import { WebClient } from "@slack/web-api";

const web = new WebClient(process.env.SLACK_BOT_TOKEN as string);

// POST - /api/vouch - Vouch a user
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const data = req.body as { id: string; status: VerificationStatus };
  const data = req.body;
  const [_user, ...reason] = data.text.split(" ") as string[];
  const userId = _user.split("|")[0].slice(2);

  if (!userId || !reason.length)
    return res.status(200).json("Request must be in the format `/vouch <@user> <reason>`");
  if (!admins.includes(data.user_id)) return res.status(401).json({ message: "Unauthorized" });

  try {
    const record = await base("Users")
      .select({ filterByFormula: `{Hack Club Slack ID} = '${userId}'` })
      .firstPage();

    if (record.length === 0) {
      const { user, ok } = await web.users.info({ user: userId });
      if (!ok || !user) return res.status(200).json("User not found");

      await base("Users").create([
        {
          fields: {
            Name: user.real_name,
            Email: user.profile?.email,
            "Hack Club Slack ID": userId,
            "Verification Status": "Vouched For",
            "Vouched By": [data.user_name],
            "Vouch Reason": reason.join(" "),
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
              "Vouch Reason": reason.join(" "),
            },
          },
        ],
        { typecast: true }
      );
    }

    return res.status(200).json("vouched successfully!");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
