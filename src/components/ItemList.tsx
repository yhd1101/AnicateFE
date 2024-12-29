// src/components/ItemList.tsx
import React from 'react';
import Card from './Card';

interface ItemListProps {
  title: string;
  items: { image: string; title: string; content: string }[];
}

const ItemList: React.FC<ItemListProps> = ({ title, items }) => {
  return (
    <div className="w-full p-6 max-w-[1000px] ">
      {/* 제목 */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-[#5CA157]">{title}</h2>
      </div>

      {/* 카드 리스트 */}
      <div className="flex gap-6 justify-center">
        {items.map((item, index) => (
          <Card
            key={index}
            image={item.image}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
