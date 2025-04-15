// PasskeyLogin.tsx - 用于 Passkey 登录
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { PasskeyService } from '@/lib/passkey.ts';
import {Button} from "@/components/ui/button.tsx";
import {KeyRound} from "lucide-react";

interface PasskeyLoginProps {
  userId: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const PasskeyLogin: React.FC<PasskeyLoginProps> = ({
                                                            userId,
                                                            onSuccess,
                                                            onError
                                                          }) => {
  const [loading, setLoading] = useState(false);
  const passkeyService = new PasskeyService();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handleLogin = async () => {
    if (!PasskeyService.isSupported()) {
      alert('您的浏览器不支持 Passkey');
      return;
    }

    setLoading(true);
    try {
      const result = await passkeyService.login(userId);
      if (result) {
        onSuccess?.();
        console.log(result);
        navigate(redirectTo);
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={loading}
      variant={"outline"}
      className="passkey-button"
    >
      <KeyRound />
      {loading ? '验证中...' : '使用 Passkey 登录'}
    </Button>
  );
};
