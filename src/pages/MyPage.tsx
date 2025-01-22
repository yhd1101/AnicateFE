import React, { useRef, useState } from "react";
import { useUserQuery } from "@/services/useUserQuery"; // React Query 훅 가져오기
import ProfileSection from "@/components/ProfileSection";
import { usePetQuery } from "@/services/usePetQuery"; // 반려동물 데이터 훅
import { PetModal } from "./PetModal";
import BigCalendar from "@/components/BigCalendar";
import Header from "@/components/Header";
import { useUpdateUser } from "@/services/useUpdateUser";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "@/services/useLogout";
import { useDeleteUser } from "@/services/useDeleteUser";
import { useDeletePet } from "@/services/useDeletePet";
import { PetUpdateModal } from "@/components/Pet/PetUpdateModal";

const Mypage: React.FC = () => {
    const queryClient = useQueryClient(); // queryClient 가져오기
  const userId = sessionStorage.getItem("id"); // userId는 sessionStorage에 저장되어 있어야 함
  const { data: userData, error: userError, isLoading: userIsLoading } = useUserQuery(Number(userId));

  console.log("sd", userData?.data.name);
  const token = sessionStorage.getItem("token"); // 토큰 가져오기

  const [name, setName] = useState(""); // 이름 상태
  const [experience, setExperience] = useState(0); // 경험 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태

  const logout = useLogout();


  const deleteUser = useDeleteUser();

  

  const handleDelete = () => {
    if (window.confirm("정말로 회원 탈퇴를 진행하시겠습니까?")) {
      deleteUser.mutate(); // 회원 탈퇴 실행
    }
  };

  const handleLogout = () => {
    logout.mutate(); // 로그아웃 실행
  };


  

  if (!userId) {
    return <div>로그인 정보가 없습니다.</div>;
  }

  // 사용자 데이터 요청
  const handleSave = async () => {

  
    if (!token) {
      alert("로그인 정보가 없습니다.");
      return;
    }
  
    const tokenWithoutQuotes = token.replace(/^"|"$/g, ""); // 따옴표 제거
  
    const updateUserDTO = {
      name: name || userData?.data.name, // 입력값이 없으면 기존 이름 사용
      years_of_experience: experience !== undefined ? experience : userData?.data.years_of_experience, // 입력값이 없으면 기존 경험치 사용
    };
  
    try {
      console.log("수정 요청 데이터:", updateUserDTO);
  
      // 서버로 데이터 전송
      const response = await axios.put(
        "http://localhost:8080/api/user",
        updateUserDTO,
        {
          headers: {
            Authorization: `Bearer ${tokenWithoutQuotes}`, // 헤더에 토큰 추가
          },
        }
      );
  
      console.log("업데이트 성공:", response.data);
  
      // 캐시 무효화: ['user', userId] 쿼리를 무효화하여 새 데이터를 가져오게 함
      await queryClient.invalidateQueries(["user", userId]);
  
      alert("사용자 정보가 성공적으로 업데이트되었습니다!");
      setIsEditing(false); // 수정 모드 종료
    } catch (error) {
      console.error("업데이트 중 오류 발생:", error);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };



  console.log("123",userData);
  // 반려동물 데이터 요청
  const { data: petData, error: petError, isLoading: petIsLoading } = usePetQuery(Number(userId));
  console.log("233311",petData);



  // 이미지 클릭 시 수정 모드로 전환
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleCancel = () => {
    setIsEditing(false); // 수정 모드 종료
  };


  // // 이름 변경
  // const handleNameChange = (e) => {
  //   setEditedName(e.target.value);
  // };

  // // 경력 변경
  // const handleExperienceChange = (e) => {
  //   setEditedExperience(e.target.value);
  // };

  // // 수정 완료
  // const handleSave = () => {
  //   // 수정 후 서버로 업데이트 요청 로직 추가 가능
  //   console.log("Saved Name:", editedName);
  //   console.log("Saved Experience:", editedExperience);
  //   setIsEditing(false);
  // };

  


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
            <p className="text-[#5CA157] font-bold">{userData?.data.email}</p>
            {isEditing ? (
              <>
                <input
                  type="text"
                  defaultValue={userData?.data.name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-[90%]  mb-4 border rounded-md text-[#5CA157] font-bold"
                />
                <input
                  type="text"
                  defaultValue={userData?.data.years_of_experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  className="w-[90%]  mb-4 border rounded-md text-[#5CA157] font-bold"
                />
                <div className="flex gap-3">
                <button   
                  onClick={handleSave}   
                  className="text-xs font-medium text-white bg-[#FF0000] py-2 px-4 rounded-md cursor-pointer hover:bg-[#999999]"
                >
                  수정하기
                </button>
                <button    
                onClick={handleCancel}  
                  className="text-xs font-medium text-white bg-[#ADADAD] py-2 px-4 rounded-md cursor-pointer hover:bg-[#999999]"
                >
                  취소
                </button>
                </div>
               
              </>
            ) : (
              // 일반 모드
              <>
             
                <p className="text-[#5CA157] font-bold">{userData?.data.name}</p>
                <p className="text-[#5CA157] font-bold">{userData?.data.years_of_experience} 년차</p>
             
           
         
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}      
                  className="text-xs font-medium text-white bg-[#FF0000] py-2 px-4 rounded-md cursor-pointer hover:bg-[#999999]"
                >
                  회원탈퇴
                </button>
                <button
                  onClick={handleLogout}      
                  className="text-xs font-medium text-white bg-[#ADADAD] py-2 px-4 rounded-md cursor-pointer hover:bg-[#999999]"
                >
                  로그아웃
                </button>
                <div
              className="flex items-center cursor-pointer"
              onClick={handleEditClick} // 이미지 클릭 시 수정 모드로 전환
            >
         
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExIDJIOUM0IDIgMiA0IDIgOVYxNUMyIDIwIDQgMjIgOSAyMkgxNUMyMCAyMiAyMiAyMCAyMiAxNVYxMyIgc3Ryb2tlPSIjMjkyRDMyIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xNi4wMzk5IDMuMDE5NzZMOC4xNTk4OCAxMC44OTk4QzcuODU5ODggMTEuMTk5OCA3LjU1OTg4IDExLjc4OTggNy40OTk4OCAxMi4yMTk4TDcuMDY5ODggMTUuMjI5OEM2LjkwOTg4IDE2LjMxOTggNy42Nzk4OCAxNy4wNzk4IDguNzY5ODggMTYuOTI5OEwxMS43Nzk5IDE2LjQ5OThDMTIuMTk5OSAxNi40Mzk4IDEyLjc4OTkgMTYuMTM5OCAxMy4wOTk5IDE1LjgzOThMMjAuOTc5OSA3Ljk1OTc2QzIyLjMzOTkgNi41OTk3NiAyMi45Nzk5IDUuMDE5NzYgMjAuOTc5OSAzLjAxOTc2QzE4Ljk3OTkgMS4wMTk3NiAxNy4zOTk5IDEuNjU5NzYgMTYuMDM5OSAzLjAxOTc2WiIgc3Ryb2tlPSIjMjkyRDMyIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE0LjkxMDIgNC4xNDk5QzE1LjU4MDIgNi41Mzk5IDE3LjQ1MDIgOC40MDk5IDE5Ljg1MDIgOS4wODk5IiBzdHJva2U9IiMyOTJEMzIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K" alt="edit"></img>
              
           
            </div>
              </div>
              </>
            )}

            {/* 이미지 */}
           
            
              
            </div>
            <div>
              
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
                    petId={pet.id}
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
        <PetUpdateModal/>
        <div className="flex flex-col items-start gap-6 w-full max-w-4xl mt-8 px-4">
          <div className="mt-4 flex">
            <h3 className="text-[#5CA157] font-bold text-2xl">스케줄 관리</h3>
          </div>
          </div>
        <BigCalendar />
      </div>
    </>
  );
};

export default Mypage;
