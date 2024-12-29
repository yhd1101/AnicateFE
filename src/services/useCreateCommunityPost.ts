import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface CommunityPostPayload {
  dto: {
    animalSpecies: string; 
    title: string;
    content: string;
  };
  file?: File | null;
}

const createCommunityPost = async ({ dto, file }: CommunityPostPayload) => {
  const formData = new FormData();
  formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
  if (file) {
    formData.append("file", file);
  }

  const token = sessionStorage.getItem("accessToken");
  const response = await axios.post("http://localhost:8080/api/community/post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const useCreateCommunityPost = () => {
  return useMutation<unknown, Error, CommunityPostPayload>(createCommunityPost);
};
