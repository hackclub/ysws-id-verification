import admins from "@/lib/admins";
import base from "@/lib/airtable";
import { User } from "@/types/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token || !token.id || !admins.includes(token.id)) return res.status(401);

  try {
    const users = await base("Users").select().all();

    return res
      .status(200)
      .json(users.map((user) => ({ ...user.fields, id: user.id } as Partial<User>)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
