import { WebClient } from "@slack/web-api";

export const web = new WebClient(process.env.SLACK_BOT_TOKEN as string);