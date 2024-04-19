import base from "@/lib/airtable";
import { withMiddleware } from "@/lib/middleware";
import { web } from "@/lib/slack";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;

  try {
    const projects = await base("Projects").select().all();
    if (!projects || projects.length === 0) return res.status(200).json("No projects found");

    await web.views.open({
      trigger_id: data.trigger_id,
      view: {
        type: "modal",
        callback_id: "grant",
        private_metadata: JSON.stringify({ channel: data.channel_id }),
        title: { type: "plain_text", text: "Log a grant" },
        blocks: [
          {
            type: "input",
            block_id: "project",
            element: {
              type: "static_select",
              placeholder: { type: "plain_text", text: "Select a project" },
              action_id: "project",
              options: projects.map((project) => ({
                text: { type: "plain_text", text: project.fields.Name as string },
                value: project.id,
              })),
            },
            label: { type: "plain_text", text: "Project" },
          },
          {
            type: "input",
            block_id: "email",
            element: {
              type: "email_text_input",
              action_id: "email",
              placeholder: { type: "plain_text", text: "Email" },
            },
            label: { type: "plain_text", text: "Email" },
          },
          {
            type: "input",
            block_id: "shipLink",
            element: {
              type: "url_text_input",
              action_id: "shipLink",
              placeholder: { type: "plain_text", text: "Ship Link" },
            },
            label: { type: "plain_text", text: "Ship Link" },
          },
          {
            type: "input",
            block_id: "airtableFormLink",
            element: {
              type: "url_text_input",
              action_id: "airtableFormLink",
              placeholder: { type: "plain_text", text: "Airtable Form Link" },
            },
            label: { type: "plain_text", text: "Airtable Form Link" },
          },
          {
            type: "input",
            optional: true,
            block_id: "customData",
            element: {
              type: "plain_text_input",
              multiline: true,
              action_id: "customData",
              placeholder: { type: "plain_text", text: "Custom Data (JSON)" },
            },
            label: { type: "plain_text", text: "Custom Data" },
          },
        ],
        submit: { type: "plain_text", text: "Submit" },
      },
    });
    res.status(200).end();
  } catch (error) {
    console.error("Error opening modal:", error);
    res.status(500).json({ error: "Failed to open modal" });
  }
}

export default withMiddleware("slack")(handler);
