import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import SlackProvider from "next-auth/providers/slack";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      SlackProvider({
        clientId: process.env.SLACK_CLIENT_ID as string,
        clientSecret: process.env.SLACK_CLIENT_SECRET as string,
        checks: ["none"],
      }),
    ],
    callbacks: {
      async jwt({ token, profile, account }) {
        console.log({ token, profile, account });
        if (profile && account) {
          token.id = profile.sub;
          token.accessToken = account.access_token;
        }

        return token;
      },
      async session({ session, token }) {
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;

        return session;
      },
    },
  });
}
