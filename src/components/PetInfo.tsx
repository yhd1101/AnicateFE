import React from 'react';

interface PetInfoProps {
  name: string;
  birthDate?: string;
  species?: string;  // 종을 받도록 수정
  breed?: string;    // 품종을 받도록 수정
  gender?: string;   // 성별 추가
  width?: string;    // 텍스트 영역의 너비
  nameFontSize?: string; // 이름 글자 크기
  infoFontSize?: string; // 정보(생년월일, 종류) 글자 크기
}

const PetInfo: React.FC<PetInfoProps> = ({ 
  name, 
  birthDate, 
  species,    // 종 표시
  breed,      // 품종 표시
  gender, 
  width = '60%', 
  nameFontSize = '1xl', 
  infoFontSize = 'xl' 
}) => {
  // 성별에 맞는 아이콘 선택
  const genderIcon = gender === '암컷' ? '♀️' : gender === '수컷' ? '♂️' : '';

  return (
    <div className="text-center" style={{ width }}>
      <div className="flex justify-center items-center mb-4">
        {/* 성별 아이콘만 출력 */}
        {genderIcon && (
          <span className="text-3xl font-semibold text-[#5CA157] mr-2">{genderIcon}</span>
        )}
        <span className={`text-${nameFontSize} font-semibold`}>{name}</span>
      </div>

      {/* 종 정보 출력 */}
      {species && (
        <div className={`text-${infoFontSize} font-semibold text-[#5CA157] mb-2`}>
          {species}
        </div>
      )}

      {/* 품종 정보 출력 */}
      {breed && (
        <div className={`text-${infoFontSize} font-semibold text-[#5CA157] mb-2`}>
          {breed}
        </div>
      )}

      {/* 생년월일 출력 */}
      {birthDate && (
        <div className={`text-${infoFontSize} font-semibold text-[#5CA157] mb-2`}>
          {birthDate} 살
        </div>
      )}
    </div>
  );
};

export default PetInfo;
