import admins from "@/lib/admins";
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

  if (session?.user.id && !admins.includes(session.user.id)) {
    return <p>Access Denied</p>;
  }

  return (
    <main>
      <h1>Verify User</h1>
      {isLoading && <p>Loading...</p>}
      <div>
        {data &&
          Object.keys(data).map((key) => {
            const item = data[key as keyof typeof data];
            return (
              <p>
                <strong key={key}>{key}</strong>:{" "}
                {typeof item === "string" || typeof item === "number" ? item : JSON.stringify(item)}
              </p>
            );
          })}
      </div>
    </main>
  );
};

export default VerifyUserPage;
