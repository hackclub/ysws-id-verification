import { SignIn } from "@/components/Auth";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });
export const ADMINS = ["U014ND5P1N2"];

export default function Home() {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!data || !data.user.id) return;

    if (ADMINS.includes(data.user.id)) router.push("/admin");
    else router.push("/dashboard");
  }, [data]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <SignIn />
    </main>
  );
}
