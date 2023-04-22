import { signIn, signOut } from "next-auth/react";
const LoginBtn = ({
  isLogin,
  sendButtonClickedData,
}: {
  isLogin: boolean;
  sendButtonClickedData: any;
}) => {
  const handleLogin = () => {
    sendButtonClickedData(true);
    void signIn();
  };

  const handleLogout = () => {
    void signOut();
  };

  if (isLogin) {
    return (
      <div className="flex w-full flex-col gap-3">
        <input
          type="email"
          title="Email"
          className="h-20 w-full rounded-2xl bg-gray-200 pl-2 font-mono text-2xl text-gray-500"
          placeholder="输入邮箱"
        ></input>
        <input
          type="password"
          title="Password"
          className="h-20 w-full rounded-2xl bg-gray-200 pl-2 text-2xl"
          placeholder="输入密码"
        ></input>
        <button
          title="Login"
          className="h-20 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-pink-500  font-sans text-2xl font-bold text-white transition-all hover:scale-105"
          onClick={handleLogin}
        >
          登录 / 注册
        </button>
      </div>
    );
  } else {
    return (
      <button
        title="Login"
        className="h-20 w-full rounded-2xl bg-gray-100 font-sans text-2xl font-bold  text-gray-600 transition-all hover:scale-105"
        onClick={handleLogout}
      >
        登出
      </button>
    );
  }
};

export default LoginBtn;
