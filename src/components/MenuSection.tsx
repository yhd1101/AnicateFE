import React from 'react';
import MenuButton from './MenuButton'; // MenuButton 컴포넌트 임포트
import { useNavigate } from 'react-router-dom';

const MenuSection: React.FC = () => {
  const navigate = useNavigate();

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
          title="병원찾기"
          onClick={() => navigate('/hospital')}
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
