import { signIn, signOut } from "next-auth/react";
import { PropsWithChildren } from "react";

export const SignIn = () => {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await signIn("slack");
      }}
    >
      <p>You are not logged in</p>
      <button type="submit">Sign in with Slack</button>
    </form>
  );
};

export const SignOut: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await signOut();
      }}
    >
      <p>{children}</p>
      <button type="submit">Sign out</button>
    </form>
  );
};
