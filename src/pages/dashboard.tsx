import { SignIn, SignOut } from "@/components/Auth";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard() {
  const { data } = useSession();

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>{data ? <SignOut>{`Welcome ${data.user?.email}`}</SignOut> : <SignIn />}</div>
    </main>
  );
}
