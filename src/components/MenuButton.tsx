import React from 'react';

interface MenuButtonProps {
  image: string;
  alt: string;
  title: string;
  onClick?: () => void; // onClick 핸들러 추가
}

const MenuButton: React.FC<MenuButtonProps> = ({ image, alt, title, onClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-6 w-full max-w-sm h-auto cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick} // 클릭 이벤트 핸들러 추가
    >
      {/* 이미지 */}
      <img src={image} alt={alt} className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
      {/* 제목 */}
      <span className="text-lg sm:text-xl md:text-2xl font-semibold text-primary font-ysabeau text-center">
        {title}
      </span>
    </div>
  );
};

export default MenuButton;
