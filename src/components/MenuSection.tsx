// src/components/MenuSection.tsx
import React from 'react';
import MenuButton from './MenuButton'; // MenuButton 컴포넌트 임포트
import { useNavigate } from 'react-router-dom';

const MenuSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#D8E6BE] flex justify-center w-[1024px] h-[270px] mx-auto my-10 rounded-lg">
      <div className="w-full max-w-3xl flex justify-center items-center gap-x-10 py-6">
        {/* 기존 버튼들을 MenuButton 컴포넌트로 대체 */}
        <MenuButton
          image="/magnifier.png"
          alt="Magnifier Icon"
          title="반려 동물정보 보기"
        />
        <MenuButton
          image="/doctor.png"
          alt="Doctor Icon"
          title="관리자와채팅하기"
        />
         <MenuButton
          image="/community.png"
          alt="Community Icon"
          title="커뮤니티"
          onClick={() => navigate('/community')} // 클릭 시 페이지 이동
        />
      </div>
    </div>
  );
};

export default MenuSection;
