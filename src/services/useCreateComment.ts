import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// 댓글 생성 API 호출
const createComment = async (data: { communityId: string, content: string }) => {
  const token = sessionStorage.getItem('token'); // sessionStorage에서 토큰 가져오기

  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(
    `http://localhost:8080/api/comments/${data.communityId}`,
    { content: data.content }, // 댓글 내용
    {
      headers: {
        Authorization: `Bearer ${token.replace(/"/g, '')}`, // token을 Authorization 헤더에 담기
      },
    }
  );

  return response.data;
};

// 댓글 생성 훅
export const useCreateComment = () => {
  return useMutation(createComment);
};
