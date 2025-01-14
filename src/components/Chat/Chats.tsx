import React from 'react';

interface ChatsProps {
 
  title: string;
  lastMessage: string;
  profileUrl: string;
}

const Chats: React.FC<ChatsProps> = ({ tag, title,lastMessage, profileUrl}) => {
  // Content 최대 길이
  const MAX_CONTENT_LENGTH = 50; // 원하는 길이 설정

  // 텍스트 자르기 함수
  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <div className="w-full max-w-2xl bg-white shadow-md rounded-lg gap-8 p-4 mb-6 flex">

        <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
            <img
            src={profileUrl}
            alt="Profile"
            className="object-cover"
            />
        </div>
        
      {/* 왼쪽: 텍스트 */}
      <div className="flex flex-col justify-center flex-1 pr-4">
        {/* 태그 */}
      

        {/* 제목 */}
        <h2 className="text-3xl font-bold line-clamp-1">{title}</h2>

        {/* 내용 */}
        <p className="text-gray-600 text-xl mt-2">
            {lastMessage}
        </p>
      </div>

      {/* 오른쪽: 이미지 */}
      {/* <div className="w-24 h-24 flex-shrink-0">
        <img
          src={imageUrl}
          alt="Community"
          className="w-full h-full object-cover rounded-md"
        />
      </div> */}
    </div>
  );
};

export default Chats;
