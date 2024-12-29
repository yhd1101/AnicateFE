// src/components/PetImage.tsx

import React from 'react';

const PetImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <div className="bg-white w-[250px] h-[300px] mx-auto rounded-full flex justify-center items-center mb-6">
      <img src={src} alt={alt} className="w-32 h-32 object-cover" />
    </div>
  );
};

export default PetImage;
