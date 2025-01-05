import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import KakaoMap from "@/components/kakao/KakaoMap";
import { useMapInfo } from "@/services/useMapInfo";

const Hospital: React.FC = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // React Query 훅으로 병원 데이터 가져오기
  const { data, isLoading, isError, error } = useMapInfo(
    userLocation?.lat || 0,
    userLocation?.lng || 0
  );

  // 데이터 로딩 상태 및 오류 처리
  if (isLoading) {
    console.log("로딩 중...");
  }
  if (isError) {
    console.error("에러 발생:", error);
  }

  // 데이터 확인
  console.log("병원 데이터:", data);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5 font-ysabeau">
          병원검색
        </h1>
        <div className="border-t-2 border-gray-300 w-[1000px] mt-2 h-2" />
        {/* KakaoMap에 사용자 위치를 설정하는 함수 전달 */}
        <KakaoMap setUserLocation={setUserLocation} />
      </div>
    </>
  );
};

export default Hospital;
