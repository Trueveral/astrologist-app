import { type AuthApiError } from "@supabase/supabase-js";

const ErrorPage = ({ error }: { error: AuthApiError }) => {
  return (
    <div>
      <h1>发生错误</h1>
      <p>{error.message}</p>
    </div>
  );
};

export default ErrorPage;
