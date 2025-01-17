import React, { useState } from 'react';
import likeIcon from '@/assets/icons/like.svg';
import activeLikeIcon from '@/assets/icons/active-like.svg';

type LikeButtonProps = {
  onClick?: React.MouseEventHandler<HTMLDivElement>; // div에 맞는 타입으로 변경
  liked: boolean;
  likeCount: number;
};

const LikeButton: React.FC<LikeButtonProps> = ({ onClick, likeCount, liked }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer"
    >
      <img
        src={liked ? activeLikeIcon : likeIcon} // 상태에 따라 이미지 변경
        alt="Like"
        className="w-4 h-4"
      />
      <span className="text-sm font-medium">{likeCount}</span>
    </div>
  );
};

export default LikeButton;
