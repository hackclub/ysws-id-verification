import admins from "@/lib/admins";
import base from "@/lib/airtable";
import { web } from "@/lib/slack";
import { checkVerification } from "@/lib/slack";
import type { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = JSON.parse(req.body.payload);
  if (payload.type === "view_submission" && payload.view.callback_id === "grant")
    await handleGrant(req, res, payload);
}

export default handler;

const handleGrant = async (req: NextApiRequest, res: NextApiResponse, payload: any) => {
  const values = payload.view.state.values;
  const project = values.project.project.selected_option.value;
  const email = values.email.email.value;
  const shipLink = values.shipLink.shipLink.value;
  const airtableFormLink = values.airtableFormLink.airtableFormLink.value;
  const customData = values.customData.customData.value;
  const channel = JSON.parse(payload.view.private_metadata).channel;

  res.status(200).end();

  if (!admins.includes(payload.user.id)) {
    return await web.chat.postEphemeral({
      channel: channel,
      user: payload.user.id,
      text: "You are not authorized to perform this action",
    });
  }

  try {
    const verify = await checkVerification(email, project, payload.user.id, channel);
    if (!verify) return;

    let customDataJson;
    try {
      customDataJson = JSON.parse(customData.trim() || "{}");
    } catch (error) {
      console.error(error);
      return await web.chat.postEphemeral({
        channel: channel,
        user: payload.user.id,
        text: "Invalid custom data - must be valid JSON",
      });
    }

    if (!validator.isURL(airtableFormLink) || !validator.isURL(shipLink))
      return await web.chat.postEphemeral({
        channel: channel,
        user: payload.user.id,
        text: "Invalid Airtable form link or Ship link",
      });

    await base("Grants").create([
      {
        fields: {
          "Project Name": [verify.project.id],
          Recipient: [verify.user.id],
          "Ship Link": shipLink,
          "Submission Form Link": airtableFormLink,
          "Custom Analytics (JSON)": JSON.stringify(customDataJson, null, 2),
        },
      },
    ]);

    return await web.chat.postEphemeral({
      channel: channel,
      user: payload.user.id,
      text:
        "Grant for " +
        verify.user.fields.Name +
        " on " +
        verify.project.fields.Name +
        " has been logged",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(200).json(error.message);
  }
};
