import { signIn } from "next-auth/react";
import Image from "next/image";
import { type provider } from "./types";
import { useState } from "react";

const ProviderBtn = ({
  provider,
  csrfToken,
  sendButtonClickedData,
}: {
  provider: provider;
  csrfToken: string;
  sendButtonClickedData: any;
}) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const handleLogin = () => {
    sendButtonClickedData(true);
    void signIn(provider.id);
  };
  return (
    <div className="w-full">
      <input type="hidden" defaultValue={csrfToken}></input>
      <button
        type="submit"
        className="h-20 w-full rounded-2xl bg-gray-200  bg-gradient-to-r font-sans text-2xl font-bold  text-gray-600 transition-all hover:scale-105"
        onClick={handleLogin}
      >
        <div className="felx-row flex items-center justify-center gap-6">
          <Image
            loading="lazy"
            width={32}
            height={32}
            className="ml-4"
            alt={provider.name}
            src={`https://authjs.dev/img/providers/${provider.id}.svg`}
          />
          <span>{`用 ${provider.name} 登录`}</span>
        </div>
      </button>
    </div>
  );
};

export default ProviderBtn;
