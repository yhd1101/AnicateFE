// src/components/ProfileSection.tsx

import React from 'react';
import PetImage from './PetImage';
import PetInfo from './PetInfo';

const ProfileSection: React.FC = () => {
  return (
    <div>
      <div className="bg-[#F6F8F1] w-[400px] h-[600px] mx-auto rounded-lg p-6">
        {/* 반려동물 이미지 */}
        <PetImage src="/image 8.png" alt="Pet Image" />

        {/* 반려동물 정보 */}
        <div className="flex justify-center items-center flex-col">
          <PetInfo name="멍멍이" birthDate="2022.8" breed="진돗개" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
