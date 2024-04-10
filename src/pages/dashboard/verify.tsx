import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import React from "react";
import useSWR from "swr";

const VerifyForm = () => {
  const { data: session, status } = useSession();
  const { data, isLoading } = useSWR<User>(
    session?.user.id ? `/api/users/slack/${session.user.id}` : null
  );

  if (status === "loading" || isLoading) {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  if (data && data["Verification Status"] === "Approved") {
    return (
      <div className="min-h-screen p-12 flex items-center justify-center">
        <h1 className="text-3xl font-semibold text-center">Your ID is verified!</h1>
      </div>
    );
  }

  if (
    data &&
    (data["Verification Status"] === "Ongoing" || data["Verification Status"] === "Pending")
  ) {
    return (
      <div className="min-h-screen p-12 flex items-center justify-center">
        <h1 className="text-3xl font-semibold text-center">
          Your ID is currently being reviewed. Please wait for a few days for the verification
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-12 flex flex-col items-center justify-center gap-2">
      {data && data["Verification Status"] === "Rejected" ? (
        <p>
          Your ID was previously rejected. Please re-submit the form with a different ID or contact
          us.
        </p>
      ) : (
        <p>
          You have not yet verified your ID. Please start the verification process by filling out
          the form below.
        </p>
      )}
      <iframe
        className="rounded max-w-4xl h-[90vh]"
        src="https://airtable.com/embed/appre1xwKlj49p0d4/pagUCWEM9v15VluC7/form"
        width="100%"
        style={{ background: "transparent", border: "1px solid #ccc" }}
      ></iframe>
    </div>
  );
};

export default VerifyForm;
