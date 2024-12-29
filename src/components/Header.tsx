import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loginModalState, loginState } from '@/recoil/atoms/loginState';
import { LoginModal } from '@/pages/LoginModal';


const Header: React.FC = () => {
  const [, setLoginModal] = useRecoilState(loginModalState); // 로그인 모달 상태
  const { isLogin } = useRecoilValue(loginState); // 로그인 상태 확인

  const handleLoginClick = () => {
    setLoginModal({ isModalOpen: true }); // 로그인 모달 열기
    
  };
  

  return (
    <div>
      <header className="w-full h-16 bg-white shadow-md flex items-center justify-between px-6">
        <div className="text-2xl font-bold text-[#5CA157]">Anicare</div>
        {!isLogin ? (
          <button
            onClick={handleLoginClick}
            className="text-lg font-medium text-gray-700 cursor-pointer"
          >
            카카오로 로그인
          </button>
        ) : (
          <div className="text-lg font-medium text-gray-700">내 정보</div>
        )}
      </header>
      <LoginModal />
    </div>
  );
};

export default Header;