import React from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  bgColor?: string;
  className?: string;
  value?: string; // value prop 추가
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // onChange prop 추가
}

const Input: React.FC<InputProps> = ({ type, placeholder, bgColor = 'white', className = '', onChange, value }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5CA157] ${className}`}
      style={{ backgroundColor: bgColor, border: 'none' }} // 테두리 제거
      value={value} // value 적용
      onChange={onChange} // onChange 적용
    />
  );
};

export default Input;
