import { SignIn, SignOut } from "@/components/Auth";
import VerificationBanner from "@/components/VerificationBanner";
import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import Link from "next/link";
import useSWR from "swr";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { data, isLoading } = useSWR<User>(
    session?.user.id ? `/api/users/slack/${session.user.id}` : null
  );

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <main className={`p-10 ${inter.className}`}>
      <div className="flex items-center justify-between mb-2">
        <p>
          Welcome {session?.user.name} ({session?.user.email})
        </p>
        <SignOut />
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : data ? (
        <div>
          <h2 className="mb-2 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Your Verification Status:
          </h2>
          <h3 className="mb-2 text-2xl font-semibold tracking-tight">
            {data["Verification Status"]}
          </h3>
          {data["Verification Status"] === "Approved" ? (
            <p>
              Your ID is verified! You can now go ahead and apply for our You Ship We Ship programs.
            </p>
          ) : ["Ongoing", "Pending", "Vouched For"].includes(data["Verification Status"]) ? (
            <p>
              Your ID is currently being verified. Please wait for a few days for the verification
              process to complete.
            </p>
          ) : data["Verification Status"] === "Rejected" ? (
            <p>Your ID has been rejected. Please re-submit the form or contact us.</p>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      {!data || data["Verification Status"] === "Rejected" ? (
        <>
          <div className="min-h-screen p-12 flex flex-col items-center justify-center gap-2">
            <iframe
              className="rounded max-w-4xl h-[90vh]"
              src="https://airtable.com/embed/appre1xwKlj49p0d4/pagUCWEM9v15VluC7/form"
              width="100%"
              style={{ background: "transparent", border: "1px solid #ccc" }}
            ></iframe>
          </div>
        </>
      ) : (
        <></>
      )}
    </main>
  );
}
