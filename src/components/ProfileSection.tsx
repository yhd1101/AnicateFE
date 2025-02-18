import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { petModalState, petUpdateModalState } from '@/recoil/atoms/loginState';
import PetImage from './PetImage';
import PetInfo from './PetInfo';
import { useDeletePet } from '@/services/useDeletePet';
import { useQueryClient } from '@tanstack/react-query';
import { PetUpdateModal } from './Pet/PetUpdateModal';

interface ProfileSectionProps {
  width?: string;
  height?: string;
  imageWidth?: string;
  imageHeight?: string;
  petInfoWidth?: string;
  nameFontSize?: string;
  infoFontSize?: string;
  containerWidth?: string;
  containerHeight?: string;
  petImageSrc?: string;
  petName?: string;
  petAge?: string;
  petSpecies?: string;  // 종을 받도록 수정
  petBreed?: string;    // 품종을 받도록 수정
  petGender?: string;   // 성별을 전달 받도록 설정 (기본값 없음)
  showEditButton?: boolean;
  petId?: number;  
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  width = '400px',
  height = '550px',
  imageWidth = '11rem',
  imageHeight = '11rem',
  petInfoWidth = '60%',
  nameFontSize = '2xl',
  infoFontSize = 'xl',
  containerWidth = '250px',
  containerHeight = '250px',
  petImageSrc = '/image 8.png',
  petName = '멍멍이',
  petAge = '13살',
  petSpecies,         // 종을 받아서 전달
  petBreed,           // 품종을 받아서 전달
  petGender,          // 성별을 전달
  showEditButton = true,
  petId,
}) => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(petModalState);
  // const [isUpdateModalOpen, setUpdateIsModalOpen] = useRecoilState(petUpdateModalState);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPetData, setSelectedPetData] = useState<any>(null);

  const queryClient = useQueryClient();

  const deletePet = useDeletePet();

  const handleDeletePet = (petId: number) => {
    if (window.confirm("정말로 이 반려동물을 삭제하시겠습니까?")) {
      deletePet.mutate(petId); // 반려동물 삭제 실행
      queryClient.invalidateQueries(["petDetails"]);
    }
 
  };

  // 클릭 시 모달 열기
  const handleProfileClick = () => {
    if (petName === '등록하기') {
      setIsModalOpen({ isModalOpen: true });
    }
  };
  const handleUpdateClick = () => {
    setSelectedPetData({
      id: petId,
      name: petName,
      age: petAge,
      speciesName: petSpecies,
      breedName: petBreed,
      gender: petGender,
      picture: petImageSrc,
    });
    setIsUpdateModalOpen(true);
  };

  return (
    <div>
      <div
        className="bg-[#F6F8F1] mx-auto rounded-lg p-6"
        style={{ width, height }}
        onClick={handleProfileClick}  // 클릭 시 모달 열리도록 설정
      >
        {/* 반려동물 이미지 */}
        <PetImage
          src={petImageSrc}
          alt="Pet Image"
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          width={imageWidth}
          height={imageHeight}
        />

        {/* 반려동물 정보 */}
        <div className="flex justify-center items-center flex-col">
          <PetInfo
            name={petName}
            birthDate={petAge}
            species={petSpecies}  // 종을 전달
            breed={petBreed}      // 품종을 전달
            gender={petGender}    // 성별을 전달
            width={petInfoWidth}
            nameFontSize={nameFontSize}
            infoFontSize={infoFontSize}
          />
        </div>

        {showEditButton && petName !== '등록하기' && (
          <div className="flex justify-end gap-2">
            <button
              onClick={handleUpdateClick}
              className="bg-[#5CA157] text-white font-semibold py-1 px-2 rounded-md hover:bg-[#4A8B42]"
            >
              수정하기
            </button>
            <button
              onClick={() => handleDeletePet(Number(petId))} 
              className="bg-[#5CA157] text-white font-semibold py-1 px-2 rounded-md hover:bg-[#4A8B42]"
            >
              삭제하기
            </button>
            
          </div>
        )}

{selectedPetData && (
        <PetUpdateModal
          petData={selectedPetData}
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}
                
      </div>
    </div>
  );
};

export default ProfileSection;
