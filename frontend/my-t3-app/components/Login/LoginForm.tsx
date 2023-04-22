import { useSession, type SessionContextValue } from "next-auth/react";
import LoginBtn from "./LoginBtn";
import ProviderBtn from "./ProviderBtn";
import { useRouter } from "next/router";
import { useState } from "react";

const errors = {
  Signin: "验证服务器错误，请尝试换一种方式登录",
  OAuthSignin: "验证服务器错误，请尝试换一种方式登录",
  OAuthCallback: "验证服务器错误，请尝试换一种方式登录",
  OAuthCreateAccount: "验证服务器错误，请尝试换一种方式登录",
  EmailCreateAccount: "验证服务器错误，请尝试换一种方式登录",
  Callback: "验证服务器错误，请尝试换一种方式登录",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
};

const SignInError = ({ error }: { error: string }) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return <div>{errorMessage}</div>;
};

const LoginForm = ({
  csrfToken,
  providers,
}: {
  csrfToken: string;
  providers: object;
}) => {
  const error = useRouter().query.error;
  const [clicked, setClicked] = useState(false);

  const handleButtonClick = (value: boolean) => {
    setClicked(value);
  };

  const { data: session }: SessionContextValue = useSession();
  return (
    <div className="flex h-screen w-screen place-content-center bg-slate-100">
      <div className="flex h-96 w-96 flex-col justify-center gap-6 place-self-center rounded-3xl border-0 border-sky-500">
        <div className="font-sans text-3xl font-bold text-sky-500">
          {session ? (
            `欢迎回来，${session.user.email ?? ""}`
          ) : (
            <div className="font-sans text-3xl font-bold text-sky-500">
              欢迎来到{" "}
              <span className="rounded-md bg-gradient-to-r from-sky-500 to-pink-500 text-white">
                Astroian
              </span>
            </div>
          )}
        </div>
        {clicked && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-500 bg-transparent">
            {" "}
          </div>
        )}
        {error && <SignInError error={error} />}
        <div className="flex flex-col gap-6">
          <div className="flex h-full w-full flex-col items-center justify-end gap-3">
            <LoginBtn isLogin={!session} />
            {Object.values(providers).map((provider) => (
              <ProviderBtn
                key={provider.id}
                provider={provider}
                csrfToken={csrfToken}
                sendButtonClickedData={handleButtonClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
