import { WebClient } from "@slack/web-api";
import base from "@/lib/airtable";

export const web = new WebClient(process.env.SLACK_BOT_TOKEN as string);

export async function checkVerification(
  email: string,
  projectId: string,
  userId: string,
  channelId: string
) {
  const user = await base("Users")
    .select({ filterByFormula: `{Email} = '${email}'` })
    .firstPage()
    .then((records) => records[0]);

  const project = await base("Projects").find(projectId);

  if (!user) {
    await web.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: `User with the email ${email} not found`,
    });
    return false;
  }

  if (
    user.fields["Verification Status"] !== "Eligible" &&
    user.fields["Verification Status"] !== "Vouched For"
  ) {
    await web.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: `User ${user.fields.Name} is not verified`,
    });
    return false;
  }

  if (!project) {
    await web.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: `Project with the ID ${projectId} not found`,
    });
    return false;
  }

  const cost = project.fields["Estimated Overall Cost Per Grant"] as number;

  if (cost > 10 && user.fields["Verification Status"] === "Vouched For") {
    await web.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: `User ${user.fields.Name} is vouched for but the project is too expensive`,
    });
    return false;
  }

  return { user, project };
}
