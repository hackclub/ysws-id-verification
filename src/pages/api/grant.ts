import admins from "@/lib/admins";
import base from "@/lib/airtable";
import type { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Command structure - /grant <project> <email> <ship-link> <maybe-airtableformlink> <custom-data-json>
  const data = req.body;
  const [project, email, shipLink, airtableFormLink, ...customData] = data.text.split(" ");
  if (!email) return res.status(200).json("Invalid user");

  if (!admins.includes(data.user_id)) return res.status(200).json("Unauthorized");

  try {
    const record = await base("Users")
      .select({ filterByFormula: `{Email} = '${email}'` })
      .firstPage()
      .then((records) => records[0]);

    if (!record) return res.status(200).json(`User ${email} not found`);
    if (
      record.fields["Verification Status"] !== "Approved" &&
      record.fields["Verification Status"] !== "Vouched For"
    )
      return res.status(200).json(`User ${email} not verified`);

    const projectRecord = await base("Projects")
      .select({ filterByFormula: `{Name} = '${project}'` })
      .firstPage()
      .then((records) => records[0]);

    if (!projectRecord) return res.status(200).json(`Project ${project} not found`);

    const customDataObj = customData.join(" ");
    let customDataJson;
    try {
      customDataJson = JSON.parse(customDataObj);
    } catch (error) {
      return res.status(200).json("Invalid custom data");
    }

    if (!validator.isURL(shipLink)) return res.status(200).json("Invalid ship link");
    if (!validator.isURL(airtableFormLink))
      return res.status(200).json("Invalid airtable form link");

    await base("Grants").create([
      {
        fields: {
          "Project Name": [projectRecord.id],
          Recipient: [record.id],
          "Ship link": shipLink,
          "Airtable Form Link": airtableFormLink,
          "Custom Analytics (JSON)": customDataJson,
        },
      },
    ]);
  } catch (error: any) {
    console.error(error);
    return res.status(200).json(error.message);
  }
}
