import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { type NextPageWithAuth, type AuthProps } from "./type";

import { api } from "~/utils/api";
import "~/styles/globals.css";

const Astroian = ({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: NextPageWithAuth;
  pageProps: { session: Session };
}) => {
  return (
    <SessionProvider session={session}>
      {Component?.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
};

const Auth = ({ children }: AuthProps) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    // if not authenticated, force log in by pushing to login page
    if (!isUser) void signIn();
  }, [isUser, status]);

  if (isUser) {
    return children;
  }

  return <div>加载中...</div>;
};

export default api.withTRPC(Astroian);
