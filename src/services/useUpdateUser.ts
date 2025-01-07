import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// 서버에 사용자 정보를 업데이트하는 함수
const updateUser = async (updateUserDTO: { name?: string; years_of_experience?: number }): Promise<string> => {
  const token = sessionStorage.getItem("token"); // 토큰 가져오기
  if (!token) {
    throw new Error("Token not found");
  }

  const tokenWithoutQuotes = token.replace(/^"|"$/g, ""); // 따옴표 제거

  const response = await axios.put(
    "http://localhost:8080/api/user",
    updateUserDTO,
    {
      headers: {
        Authorization: `Bearer ${tokenWithoutQuotes}`, // 헤더에 토큰 추가
      },
    }
  );

  return response.data;
};

// React Query Mutation Hook
export const useUpdateUser = () => {
  return useMutation<string, Error, { name?: string; years_of_experience?: number }>(
    updateUser // mutationFn 전달
  );
};
