import React from 'react';
import Card from './Card';

interface Item {
  id: number;
  image: string;
  title: string;
  content: string;
}

interface ItemListProps {
  title: string;
  items: Item[];
  onItemClick?: (id: number) => void; // 클릭 이벤트 핸들러
}

const MAX_CONTENT_LENGTH = 100; // 최대 표시할 글자 수

const truncateContent = (content: string, maxLength: number) => {
  return content.length > maxLength
    ? content.slice(0, maxLength) + '...'
    : content;
};

const ItemList: React.FC<ItemListProps> = ({ title, items, onItemClick }) => {
  return (
    <div className="w-full p-6 max-w-[1000px] ">
      {/* 제목 */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-[#5CA157]">{title}</h2>
      </div>

      {/* 카드 리스트 */}
      <div className="flex gap-6 justify-center">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item.id)} // 클릭 이벤트 처리
            className="cursor-pointer"
          >
            <Card
              image={item.image}
              title={item.title}
              content={truncateContent(item.content, MAX_CONTENT_LENGTH)} // 잘라낸 content 전달
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
