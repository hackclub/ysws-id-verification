import { SignIn, SignOut } from "@/components/Auth";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/ui/users/columns";
import { DataTable } from "@/components/ui/users/data-table";
import admins from "@/lib/admins";
import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import useSWR from "swr";

const inter = Inter({ subsets: ["latin"] });

export default function Admin() {
  const { data: session, status } = useSession();
  const { data, isLoading } = useSWR<User[]>("/api/users");

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <main className={`p-10 flex items-center justify-center ${inter.className}`}>
        <SignIn />
      </main>
    );
  }

  if (session?.user.id && !admins.includes(session.user.id)) {
    return <p>Access Denied</p>;
  }

  const pendingUsers =
    data?.filter(
      (d) => d["Verification Status"] === "Unknown" || d["Verification Status"] === "Vouched For"
    ) || [];

  return (
    <main className={`p-10 ${inter.className}`}>
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Admin Dashboard</h1>
        <SignOut />
      </div>
      <h2 className="mt-10 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Pending Verifications
      </h2>
      {isLoading && <p>Loading...</p>}
      {pendingUsers.length > 0 ? (
        pendingUsers.map((person) => <VerifyUser key={person.id} person={person} />)
      ) : (
        <p className="text-center mt-5 text-gray-700">No pending verifications</p>
      )}
      <h2 className="mt-10 mb-5 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        All Users
      </h2>
      <DataTable
        columns={columns}
        data={(data || []).map((d) => ({
          id: d.id,
          name: d.Name,
          email: d.Email,
          slack: d["Hack Club Slack ID"],
          status: d["Verification Status"],
        }))}
      />
    </main>
  );
}

const VerifyUser: React.FC<{ person: User }> = ({ person }) => {
  const router = useRouter();

  return (
    <div
      key={person.Email}
      className="flex items-center justify-between p-4 my-4 rounded-md border shadow"
    >
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">{person.Name}</h3>
        <p className="text-sm">{person["Hack Club Slack ID"]}</p>
        <p className="text-sm">{person.Email}</p>
      </div>
      <Button onClick={() => router.push(`/verify/${person.id}`)}>Start Verification</Button>
    </div>
  );
};
