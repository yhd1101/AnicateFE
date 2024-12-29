// src/components/PetInfo.tsx

import React from 'react';

const PetInfo: React.FC<{ name: string; birthDate: string; breed: string }> = ({ name, birthDate, breed }) => {
  return (
    <div className="text-center w-[60%]">
      <div className="flex justify-center items-center mb-4">
        <span className="text-3xl font-semibold text-[#5CA157] mr-2">🐶</span>
        <span className="text-2xl font-semibold">{name}</span>
      </div>
      <div className="text-xl font-semibold text-[#5CA157] mb-4">{birthDate} (생년월일)</div>
      <div className="text-xl font-semibold text-[#5CA157] mb-6">{breed} (종류)</div>
    </div>
  );
};

export default PetInfo;
