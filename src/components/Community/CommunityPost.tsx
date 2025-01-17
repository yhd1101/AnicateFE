import React from 'react';
import LikeButton from '../Button/LikeButton';
import commentIcon from '@/assets/icons/comment.svg';


interface CommunityPostProps {
  tag: string;
  title: string;
  content: string;
  imageUrl: string;
  commentCount: number;
  likeCount: number;
}

const CommunityPost: React.FC<CommunityPostProps> = ({ tag, title, content, imageUrl, commentCount, likeCount }) => {
  // Content 최대 길이
  const MAX_CONTENT_LENGTH = 50; // 원하는 길이 설정

  // 텍스트 자르기 함수
  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4 mb-6 flex">
      {/* 왼쪽: 텍스트 */}
      <div className="flex flex-col  flex-1 pr-4">
        {/* 태그 */}
        <div className="bg-[#D8E6BE] text-black text-sm font-semibold px-2 py-1 rounded-md w-max">
          {tag}
        </div>

        {/* 제목 */}
        <h2 className="text-base font-bold mt-2 line-clamp-1">{title}</h2>

        {/* 내용 */}
        <p className="text-gray-600 text-sm mt-2">
          {truncateText(content, MAX_CONTENT_LENGTH)}
        </p>
      </div>

      {/* 오른쪽: 이미지 */}
      <div className='flex-col'>
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={imageUrl}
            alt="Community"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div className='flex itemts-center gap-3'>
          <LikeButton likeCount={likeCount}/>
          <div
            className={`flex items-center gap-2 cursor-pointer`}
          >
            <img
              src={commentIcon} // 상태에 따라 이미지 변경
              alt="comment"
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">
              {commentCount}
            </span>
          </div>
        
        </div>
 
      </div>
     
    </div>
  );
};

export default CommunityPost;
