import { SignOut } from "@/components/Auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { columns } from "@/components/ui/users/columns";
import { DataTable } from "@/components/ui/users/data-table";
import admins from "@/lib/admins";
import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import useSWR from "swr";

const inter = Inter({ subsets: ["latin"] });

const Admin = () => {
  const { data: session, status } = useSession();
  const { data, isLoading } = useSWR<User[]>("/api/users");

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  if (session?.user.id && !admins.includes(session.user.id)) {
    return <p>Access Denied</p>;
  }

  const pendingUsers =
    data?.filter(
      (d) => d["Verification Status"] === "Ongoing" || d["Verification Status"] === "Pending"
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
          slackId: d["Hack Club Slack ID"],
          age: d["Age (years)"],
          status: d["Verification Status"],
        }))}
      />
    </main>
  );
};

export default Admin;

const VerifyUser: React.FC<{ person: User }> = ({ person }) => {
  const { toast } = useToast();
  const router = useRouter();

  const startVerification = async (start: boolean) => {
    try {
      if (start) {
        await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: person.id, status: "Ongoing" }),
        });

        toast({
          title: "Success",
          description: `Verification started for ${person.Name}`,
          duration: 2000,
        });
      }

      router.push(`/admin/verify/${person.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      key={person.Email}
      className="flex items-center justify-between p-4 my-4 rounded-md border shadow"
    >
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">{person.Name}</h3>
        <p className="text-sm">{person["Age (years)"]} years old</p>
        <p className="text-sm">{person.Email}</p>
      </div>
      {person["Verification Status"] === "Pending" ? (
        <Button onClick={() => startVerification(true)}>Start Verification</Button>
      ) : (
        <Button onClick={() => startVerification(false)}>Continue Verification</Button>
      )}
    </div>
  );
};
