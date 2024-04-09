import { ADMINS } from "@/pages";
import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";

const VerifyUserPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, isLoading } = useSWR<User>(
    router.query.id ? `/api/users/${router.query.id}` : undefined
  );

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  if (session?.user.id && !ADMINS.includes(session.user.id)) {
    return <p>Access Denied</p>;
  }

  return (
    <main>
      <h1>Verify User</h1>
      {isLoading && <p>Loading...</p>}
      {data && (
        <div>
          <h2>{data.Name}</h2>
          <p>{data.Email}</p>
        </div>
      )}
    </main>
  );
};

export default VerifyUserPage;
