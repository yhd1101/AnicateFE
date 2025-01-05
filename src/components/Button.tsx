import React from "react";

interface ButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // 이벤트 객체를 받을 수 있도록 타입 지정
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button type="button" onClick={onClick} className={className}>
      {text}
    </button>
  );
};

export default Button;
