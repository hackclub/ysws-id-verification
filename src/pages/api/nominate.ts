import admins from "@/lib/admins";
import base from "@/lib/airtable";
import { VerificationStatus } from "@/types/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

// POST - /api/verify - Update a user's verification status
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body as { id: string; status: VerificationStatus };

  const token = await getToken({ req });
  if (!token || !token.id || !admins.includes(token.id) || !token.name) return res.status(401);

  try {
    const user = await base("Users").find(data.id);
    const nominatedBy = [...((user.fields["Nominated By"] as string[]) || []), token.name];

    await base("Users").update(
      [
        {
          id: data.id,
          fields: {
            "Nominated By": Array.from(new Set(nominatedBy)),
          },
        },
      ],
      { typecast: true }
    );

    return res.status(200).json("ok");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
