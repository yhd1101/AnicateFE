// src/components/Button.tsx

import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#5CA157] text-white font-medium rounded-md p-2 hover:bg-[#4a8b42] transition ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
