import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import admins from "@/lib/admins";
import { User, VerificationStatus } from "@/types/user";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";

const VerifyUserPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading } = useSWR<User>(
    router.query.id ? `/api/users/${router.query.id}` : undefined
  );

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  if (session?.user.id && !admins.includes(session.user.id)) {
    return <p>Access Denied</p>;
  }

  const handleVerification = async (status: VerificationStatus) => {
    try {
      if (!data) return;

      await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: data.id, status: status }),
      });

      toast({
        title: "Success",
        description: `Identity verification ${status} for ${data.Name}`,
        duration: 2000,
      });

      router.push(`/admin/verify/${data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className={`p-10`}>
      <h2 className="mb-10 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Verify User
      </h2>
      {isLoading && <p>Loading...</p>}
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center justify-between w-full">
          <p>{data?.id}</p>
          <p className="px-2 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
            {data?.["Verification Status"]}
          </p>
        </div>

        <div>
          <strong>Proof:</strong>
          {data?.["Proof of Student"].map((proof) => (
            <Image
              priority
              key={proof.id}
              src={proof.thumbnails.large.url}
              alt={proof.filename}
              width={proof.width}
              height={proof.height}
              className="max-h-96 w-auto"
            />
          ))}
        </div>

        <div>
          <p>
            <strong>Name:</strong> {data?.Name}
          </p>
          {data?.["Hack Club Slack ID"] && (
            <p>
              <strong>Slack Profile:</strong>{" "}
              <a
                className="font-medium text-primary underline underline-offset-4"
                href={`https://hackclub.slack.com/team/${data?.["Hack Club Slack ID"]}`}
              >
                {data?.["Hack Club Slack ID"]}
              </a>
            </p>
          )}
          <p>
            <strong>Email:</strong> {data?.Email}
          </p>
          <p>
            <strong>Phone:</strong> {data?.["Phone (optional)"]}
          </p>
          <p>
            <strong>Birthday:</strong> {data?.Birthday}
          </p>
          <p>
            <strong>Age:</strong> {data?.["Age (years)"]} ({data?.Grade}th grade)
          </p>
          <p>
            <strong>School:</strong> {data?.["School Name"]} ({data?.["School Address"]})
          </p>
          <p>
            <strong>Is a club member?</strong> {data?.["Club Member"] ? "Yes" : "No"}
          </p>
          {data?.["Club Member"] && (
            <p>
              <strong>Club Name:</strong> {data?.["Club Name"]}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleVerification("Approved")}
            disabled={data?.["Verification Status"] === "Approved"}
          >
            Approve
          </Button>
          <Button
            onClick={() => handleVerification("Rejected")}
            disabled={data?.["Verification Status"] === "Rejected"}
            variant="destructive"
          >
            Reject
          </Button>
        </div>
      </div>
    </main>
  );
};

export default VerifyUserPage;
