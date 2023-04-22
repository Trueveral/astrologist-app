import LoginForm from "components/Login/LoginForm";
import { getProviders, getCsrfToken } from "next-auth/react";
import { type CtxOrReq } from "next-auth/client/_utils";
import React from "react";

const LoginPage = ({
  csrfToken,
  providers,
}: {
  csrfToken: string;
  providers: object;
}) => {
  return <LoginForm csrfToken={csrfToken} providers={providers} />;
};

export const getServerSideProps = async (context: { context: CtxOrReq }) => {
  const csrfToken = await getCsrfToken(context.context);
  const providers = await getProviders();
  // console.log(csrfToken);
  return { props: { csrfToken, providers } };
};

export default LoginPage;
