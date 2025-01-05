import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loginModalState, loginState } from '@/recoil/atoms/loginState';
import { LoginModal } from '@/pages/LoginModal';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [, setLoginModal] = useRecoilState(loginModalState); // 로그인 모달 상태
  const [loginStatus, setLoginStatus] = useRecoilState(loginState); // 로그인 상태 확인
  const navigate = useNavigate(); // useNavigate 훅 추가
  
  // 새로고침 후에도 로그인 상태 유지
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setLoginStatus({ isLogin: true });
    } else {
      setLoginStatus({ isLogin: false });
    }
  }, [setLoginStatus]);

  const handleLoginClick = () => {
    setLoginModal({ isModalOpen: true }); // 로그인 모달 열기
  };

  const handleMyPageClick = () => {
    console.log("mypage")
    navigate('/mypage'); // 내 정보 버튼 클릭 시 /mypage로 이동
  };
  const handleHomeClick = () => {
    navigate('/'); // 내 정보 버튼 클릭 시 /mypage로 이동
  };

  return (
    <div>
      <header className="w-full h-16 bg-white shadow-md flex items-center justify-between px-6">
        <div  onClick={handleHomeClick} className="text-2xl font-bold text-[#5CA157]">Anicare</div>
        {!loginStatus.isLogin ? (
          <button
            onClick={handleLoginClick}
            className="text-lg font-medium text-white bg-[#ADADAD] py-2 px-4 rounded-md cursor-pointer hover:bg-[#999999]"
          >
            로그인
          </button>
        ) : (
          <div 
          onClick={handleMyPageClick}
          className="text-lg font-medium text-white bg-[#ADADAD] py-2 px-4 rounded-md cursor-pointer hover:bg-[#999999]">
            내 정보
          </div>
        )}
      </header>
      <LoginModal />
    </div>
  );
};

export default Header;
