import React from 'react';
import MenuButton from './MenuButton'; // MenuButton 컴포넌트 임포트
import { useNavigate } from 'react-router-dom';

const MenuSection: React.FC = () => {
  const navigate = useNavigate();

  const checkAuthAndNavigate = (path: string) => {
    const token = sessionStorage.getItem('token'); // sessionStorage에서 토큰 확인
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/'); // 로그인 페이지로 이동
      return;
    }
    navigate(path); // 로그인된 경우 해당 경로로 이동
  };

  return (
    <div className="bg-[#D8E6BE] flex justify-center w-[1024px] max-w-full h-full mx-auto my-10 rounded-lg px-4">
      <div className="w-full flex flex-wrap md:flex-nowrap justify-center items-center gap-4 md:gap-10 py-6">
        {/* 기존 버튼들을 MenuButton 컴포넌트로 대체 */}
        <MenuButton
          image="/magnifier.png"
          alt="Magnifier Icon"
          title="반려 동물정보 보기"
          onClick={() => navigate('/information')}
        />
        <MenuButton
          image="/doctor.png"
          alt="Doctor Icon"
          title="관리자와채팅"
          onClick={() => checkAuthAndNavigate('/chatlist')} // 인증 체크 후 이동
        />
        <MenuButton
          image="/community.png"
          alt="Community Icon"
          title="커뮤니티"
          onClick={() => navigate('/community')}
        />
      </div>
    </div>
  );
};

export default MenuSection;
