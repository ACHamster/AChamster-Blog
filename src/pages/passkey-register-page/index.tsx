import React from 'react';
import { useNavigate } from 'react-router';
import { PasskeyRegister } from '@/components/passkey-register';

const PasskeyRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    alert('Passkey 绑定成功！');
    navigate('/');
  };

  const handleError = (error: Error) => {
    alert(`Passkey 绑定失败：${error.message}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">绑定 Passkey</h2>
        <div className="text-center">
          <PasskeyRegister 
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      </div>
    </div>
  );
};

export default PasskeyRegisterPage;
