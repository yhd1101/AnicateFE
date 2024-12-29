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
      className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-6 w-[340px] h-[200px] cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick} // 클릭 이벤트 핸들러 추가
    >
      <img src={image} alt={alt} className="w-16 h-16 mb-4" />
      <span className="text-2xl font-semibold text-primary font-ysabeau text-center">
        {title}
      </span>
    </div>
  );
};

export default MenuButton;
