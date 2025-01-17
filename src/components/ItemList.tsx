import React, { useState, useEffect } from 'react';
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
const ITEMS_PER_PAGE = 1; // 반응형에서 한 페이지에 보여줄 아이템 수

const truncateContent = (content: string, maxLength: number) => {
  return content.length > maxLength
    ? content.slice(0, maxLength) + '...'
    : content;
};

const ItemList: React.FC<ItemListProps> = ({ title, items, onItemClick }) => {
  const [isResponsive, setIsResponsive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth <= 1024);
    };

    handleResize(); // 초기 실행
    window.addEventListener('resize', handleResize); // 리스너 등록
    return () => window.removeEventListener('resize', handleResize); // 클린업
  }, []);

  // 현재 페이지에 표시할 아이템 계산
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  return (
    <div className="w-full p-6 max-w-[1000px] mx-auto">
      {/* 제목 */}
      <div className="mb-6 title-container">
        <h2 className="text-3xl font-semibold text-[#5CA157]">{title}</h2>
      </div>

      {/* 카드 리스트 또는 페이지네이션 */}
      {!isResponsive ? (
        <div className="item-container flex gap-6 flex-wrap lg:flex-nowrap lg:justify-start sm:justify-center sm:items-center">
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
      ) : (
        <>
          {/* 현재 페이지의 아이템 */}
          <div className="item-container flex justify-center">
            {paginatedItems.map((item) => (
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

          {/* 페이지네이션 */}
          <div className="pagination-container flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-3 h-3 rounded-full ${
                  currentPage === index + 1
                    ? 'bg-[#5CA157]'
                    : 'bg-gray-300'
                } hover:bg-[#4A8B42]`}
              />
            ))}
          </div>
        </>
      )}

      {/* 스타일 정의 */}
      <style jsx>{`
        .pagination-container button {
          border: none;
          cursor: pointer;
        }
        .pagination-container button:focus {
          outline: none;
        }
        @media (max-width: 1024px) {
          .title-container {
            text-align: center !important;
          }
          .item-container {
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemList;
