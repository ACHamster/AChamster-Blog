import React, { useState } from 'react';
import { PasskeyService } from '@/lib/passkey';

interface PasskeyRegisterProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const PasskeyRegister: React.FC<PasskeyRegisterProps> = ({
                                                                  onSuccess,
                                                                  onError
                                                                }) => {
  const [loading, setLoading] = useState(false);
  const passkeyService = new PasskeyService();

  const handleRegister = async () => {
    if (!PasskeyService.isSupported()) {
      alert('您的浏览器不支持 Passkey');
      return;
    }

    setLoading(true);
    try {
      const result = await passkeyService.register();
      if (result) {
        onSuccess?.();
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRegister}
      disabled={loading}
      className="passkey-button"
    >
      {loading ? '绑定中...' : '绑定 Passkey'}
    </button>
  );
};
