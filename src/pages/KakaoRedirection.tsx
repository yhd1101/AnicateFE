import { ClipLoader } from 'react-spinners';
import { useEffect } from 'react';
import { useLogin } from '@/hooks/Auth/useAuth';
export const KakaoRedirection = () => {
  const login = useLogin();
  useEffect(() => {
    login;
  });
  return (
    <div className="flex h-screen w-full justify-center">
      <ClipLoader color="#36d7b7" loading={true} size={50} />
    </div>
  );
};