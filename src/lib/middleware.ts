import * as crypto from "crypto";
import { label, Middleware } from "next-api-middleware";
import qs from "qs";

const slack: Middleware = async (req, res, next) => {
  const slackSignature = req.headers["x-slack-signature"] as string;
  const requestBody = qs.stringify(req.body, { format: "RFC1738" });
  const timestamp = req.headers["x-slack-request-timestamp"] as unknown as number;
  const time = Math.floor(new Date().getTime() / 1000);

  if (Math.abs(time - timestamp) > 300) return res.status(400).send("Ignore this request.");

  const slackSigningSecret = process.env.SLACK_SIGNING_SECRET as string | undefined;
  if (!slackSigningSecret) return res.status(400).send("Slack signing secret is empty.");

  const sigBasestring = "v0:" + timestamp + ":" + requestBody;
  const mySignature =
    "v0=" +
    crypto.createHmac("sha256", slackSigningSecret).update(sigBasestring, "utf8").digest("hex");

  if (
    crypto.timingSafeEqual(Buffer.from(mySignature, "utf8"), Buffer.from(slackSignature, "utf8"))
  ) {
    console.log("Verification successful");
    return next();
  } else {
    return res.status(400).send("Verification failed");
  }
};

export const withMiddleware = label({ slack });
