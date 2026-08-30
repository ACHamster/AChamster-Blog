import React from 'react';
import {LoginForm} from "@/components/login-form.tsx";

const Login :React.FC = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <title>登录 - AChamster Blog</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="w-full max-w-sm">
        <LoginForm/>
      </div>
    </div>
  );
};

export default Login;
