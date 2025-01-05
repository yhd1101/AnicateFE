import React, { useRef, useState } from "react";
import { useUserQuery } from "@/services/useUserQuery"; // React Query 훅 가져오기
import ProfileSection from "@/components/ProfileSection";
import { usePetQuery } from "@/services/usePetQuery"; // 반려동물 데이터 훅
import { PetModal } from "./PetModal";
import BigCalendar from "@/components/BigCalendar";
import Header from "@/components/Header";

const Mypage: React.FC = () => {
  const userId = sessionStorage.getItem("id"); // userId는 sessionStorage에 저장되어 있어야 함

  if (!userId) {
    return <div>로그인 정보가 없습니다.</div>;
  }

  // 사용자 데이터 요청
  const { data: userData, error: userError, isLoading: userIsLoading } = useUserQuery(Number(userId));

  console.log("123",userData);
  // 반려동물 데이터 요청
  const { data: petData, error: petError, isLoading: petIsLoading } = usePetQuery(Number(userId));
  console.log(petData);

  // 스크롤 컨테이너 및 버튼 관리
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 스크롤 이동 함수
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 300; // 300px씩 스크롤
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 300; // 300px씩 스크롤
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center">
        {/* 유저 정보 섹션 */}
        <div className="flex flex-col items-start gap-6 w-full max-w-4xl mt-8 px-4">
          <div className="mt-4 flex">
            <h3 className="text-[#5CA157] font-bold text-2xl">유저 정보</h3>
          </div>
          <div className="flex justify-center items-center gap-6 w-full max-w-4xl mt-8">
            {/* 프로필 이미지 */}
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <img
                src={userData?.data.profileImg}
                alt="Profile"
                className="object-cover"
              />
            </div>

            {/* 사용자 정보 */}
            <div className="flex flex-col gap-1 justify-start">
              <p className="text-[#5CA157] font-bold">{userData?.data.years_of_experience} 년차</p>
              <p className="text-[#5CA157] font-bold">{userData?.data.name}</p>
              <p className="text-[#5CA157] font-bold">{userData?.data.email}</p>
              <div className="flex gap-3">
                <button      
                  className="text-xs font-medium text-white bg-[#FF0000] py-2 px-4 rounded-md cursor-pointer hover:bg-[#999999]"
                >
                  회원탈퇴
                </button>
                <button      
                  className="text-xs font-medium text-white bg-[#ADADAD] py-2 px-4 rounded-md cursor-pointer hover:bg-[#999999]"
                >
                  로그아웃
                </button>
              </div>
            
              
            </div>
            <div>
              
            </div>
            <div className="">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExIDJIOUM0IDIgMiA0IDIgOVYxNUMyIDIwIDQgMjIgOSAyMkgxNUMyMCAyMiAyMiAyMCAyMiAxNVYxMyIgc3Ryb2tlPSIjMjkyRDMyIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xNi4wMzk5IDMuMDE5NzZMOC4xNTk4OCAxMC44OTk4QzcuODU5ODggMTEuMTk5OCA3LjU1OTg4IDExLjc4OTggNy40OTk4OCAxMi4yMTk4TDcuMDY5ODggMTUuMjI5OEM2LjkwOTg4IDE2LjMxOTggNy42Nzk4OCAxNy4wNzk4IDguNzY5ODggMTYuOTI5OEwxMS43Nzk5IDE2LjQ5OThDMTIuMTk5OSAxNi40Mzk4IDEyLjc4OTkgMTYuMTM5OCAxMy4wOTk5IDE1LjgzOThMMjAuOTc5OSA3Ljk1OTc2QzIyLjMzOTkgNi41OTk3NiAyMi45Nzk5IDUuMDE5NzYgMjAuOTc5OSAzLjAxOTc2QzE4Ljk3OTkgMS4wMTk3NiAxNy4zOTk5IDEuNjU5NzYgMTYuMDM5OSAzLjAxOTc2WiIgc3Ryb2tlPSIjMjkyRDMyIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE0LjkxMDIgNC4xNDk5QzE1LjU4MDIgNi41Mzk5IDE3LjQ1MDIgOC40MDk5IDE5Ljg1MDIgOS4wODk5IiBzdHJva2U9IiMyOTJEMzIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K" alt="edit"></img>
              <div className="invisible">""</div>
              <div className="invisible">""</div>
              <div className="invisible">""</div>
              <div className="invisible">""</div>
            </div>
           
          </div>
        </div>

        {/* 나의 반려동물 섹션 */}
        <div className="flex flex-col items-start gap-6 w-full max-w-4xl mt-8 mb-8 px-4">
          <h3 className="text-[#5CA157] font-bold text-2xl">나의 반려동물</h3>

          {/* 스크롤 가능한 영역 */}
          <div className="relative w-full ">
            <div
              className="flex gap-8 overflow-x-auto"
              ref={scrollContainerRef} // Scroll 컨테이너를 참조
              style={{
                maxWidth: "100%", // 가로로 화면 크기에 맞게
                overflowY: "hidden", // 세로 스크롤은 숨기기
              }}
            >
              {/* petData 배열을 순회하면서 ProfileSection을 동적으로 생성 */}
              {petData?.data?.length ? (
                petData.data.map((pet) => (
                  <ProfileSection
                    key={pet.id}
                    width="300px"
                    height="400px"
                    imageWidth="6rem"
                    imageHeight="6rem"
                    containerHeight="150px"
                    containerWidth="150px"
                    petSpecies={pet.speciesName}
                    petBreed={pet.breedName}
                    petGender={pet.gender}
                    petName={pet.name}
                    petAge={pet.age}
                    petImageSrc={pet.picture}
                  />
                ))
              ) : (
                [] // 빈 배열을 반환
              )}

              {/* '등록하기' 버튼 */}
              <ProfileSection
                width="300px"
                height="400px"
                petImageSrc="plus.png"
                imageWidth="6rem"
                imageHeight="6rem"
                containerHeight="150px"
                containerWidth="150px"
                showEditButton={false}
                petName="등록하기"
                petAge=""
                petBreed=""
              />
            </div>

            {/* 왼쪽 및 오른쪽 스크롤 버튼 */}
            {petData?.data.length > 3 && (
              <>
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2"
                  onClick={handleScrollLeft}
                >
                  <img src="/left.png" alt="Scroll Left" className="w-8 h-8" />
                </button>

                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2"
                  onClick={handleScrollRight}
                >
                  <img src="/right.png" alt="Scroll Right" className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>

        <PetModal />
        <div className="mt-4 flex">
            <h3 className="text-[#5CA157] font-bold text-2xl">유저 정보</h3>
          </div>
        <BigCalendar />
      </div>
    </>
  );
};

export default Mypage;
