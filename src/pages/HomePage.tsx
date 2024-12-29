// src/pages/HomePage.tsx

import React from 'react';
import SearchSection from '../components/search/SearchSection';
import MenuSection from '../components/MenuSection';
import ProfileSection from '../components/ProfileSection';
import Calendar from '../components/Calendar';
import PopularHospitals from '../components/PopularHospitals';
import PopularCommunities from '../components/PopularCommunities';
import { useRecoilValue } from 'recoil';
import { loginState } from '@/recoil/atoms/loginState';

const HomePage: React.FC = () => {
  const { isLogin } = useRecoilValue(loginState);
  return (
    <div >
      <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5 font-ysabeau">
        내 주변 동물병원
      </h1>
      <SearchSection />
      <MenuSection />
      {isLogin && (
        <div className="flex justify-center gap-20 mb-6">
          <ProfileSection />
          <Calendar reminderMessage="매주 화요일 예약, 금요일은 정기 점검!" />
        </div>
      )}

      <div className='flex justify-center'> {/* PopularHospitals와 PopularCommunities 사이의 간격 */}
        <PopularHospitals />
      </div>
      <div className="flex justify-center'"> {/* 이 부분에서 PopularCommunities 사이에 여백을 추가 */}
        <PopularCommunities />
      </div>

    
    </div>
  );
};

export default HomePage;
