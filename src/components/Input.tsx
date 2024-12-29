import React from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  bgColor?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ type, placeholder, bgColor = 'white', className = '' }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5CA157] ${className}`}
      style={{ backgroundColor: bgColor, border: 'none' }} // 테두리 제거
    />
  );
};

export default Input;
