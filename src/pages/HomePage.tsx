import React, { useState } from 'react';
import SearchSection from '../components/search/SearchSection';
import MenuSection from '../components/MenuSection';
import ProfileSection from '../components/ProfileSection';
import Calendar from '../components/Calendar';
import PopularHospitals from '../components/PopularInformation';
import PopularCommunities from '../components/PopularCommunities';
import { useRecoilValue } from 'recoil';
import { loginState } from '@/recoil/atoms/loginState';
import Header from '@/components/Header';
import { usePetQuery } from '@/services/usePetQuery';
import { useSingleScheduleQuery } from '@/services/useScheduleData';
import PopularInformation from '../components/PopularInformation';
import CommentCommunity from '@/components/CommentCommunity';


const HomePage: React.FC = () => {
  const { isLogin } = useRecoilValue(loginState);
  const userId = sessionStorage.getItem("id");
  const [gu, setGu] = useState(""); // 구 상태
  const [dong, setDong] = useState(""); // 동 상태

  // 반려동물 데이터 가져오기
  const { data: petData } = usePetQuery(Number(userId));

  // 일정 데이터 가져오기
  const { data: scheduleData } = useSingleScheduleQuery();

  const handleSearch = (inputGu: string, inputDong: string) => {
    setGu(inputGu); // 입력된 구 값을 업데이트
    setDong(inputDong); // 입력된 동 값을 업데이트
  };

  // 오늘 날짜
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const todayFormatted = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  // 현재 달의 스케줄 날짜 배열 생성
  const scheduleDates = scheduleData
    ?.map((schedule: any) => schedule.startDatetime.split('T')[0])
    .filter((date: string) => {
      const [year, month] = date.split('-');
      return parseInt(year) === currentYear && parseInt(month) === currentMonth;
    }) || [];

  // 오늘 일정 확인
  const todaySchedules = scheduleData?.filter((schedule: any) => {
    const scheduleDate = schedule.startDatetime.split('T')[0];
    return scheduleDate === todayFormatted;
  }) || [];

  // 가장 작은 id 값을 가진 데이터 가져오기
  const petWithSmallestId = petData?.data?.sort((a, b) => a.id - b.id)?.[0];

  return (
    <div>
      <Header />
      <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5 font-ysabeau">
        내 주변 동물병원
      </h1>
      <SearchSection onSearch={handleSearch}/>
      <MenuSection />
      {isLogin && (
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-6">
          {/* 반려동물 정보 렌더링 */}
          {petWithSmallestId ? (
            <ProfileSection
              showEditButton={false}
              petImageSrc={petWithSmallestId.picture}
              petName={petWithSmallestId.name}
              petAge={petWithSmallestId.age}
              petSpecies={petWithSmallestId.speciesName}
              petBreed={petWithSmallestId.breedName}
              petGender={petWithSmallestId.gender}
            />
          ) : (
            <ProfileSection
              showEditButton={false}
              petImageSrc="/image 8.png"
              petName="멍멍이"
              petAge="1"
              petSpecies="강아지"
              petBreed="푸들"
              petGender="수컷"
            />
          )}

          {/* 캘린더 */}
          <Calendar 
            reminderMessage={
              todaySchedules.length > 0 
                ? todaySchedules.map((schedule) => schedule.name).join(", ") 
                : "오늘은 일정이 없습니다."
            }
            scheduleDates={scheduleDates} // 스케줄 날짜 전달
          />
        </div>
      )}


      {/* 병원 및 커뮤니티 섹션 */}
      <div className="flex justify-center">
        <PopularInformation />
      </div>
      <div className="flex justify-center">
        <CommentCommunity/>
      </div>
    </div>
  );
};

export default HomePage;
