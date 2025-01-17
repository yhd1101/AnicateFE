import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const CommunityPost: React.FC = () => {
  const navigate = useNavigate();
  const [animalSpecies, setAnimalSpecies] = useState(""); // 단일 문자열
  const queryClient = useQueryClient(); // React Query Client 인스턴스
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSpeciesKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (animalSpecies.trim()) {
        alert("이미 입력된 종이 있습니다.");
        return;
      }
      if (!e.currentTarget.value.trim()) {
        alert("종을 입력해주세요.");
        return;
      }
      setAnimalSpecies(e.currentTarget.value.trim());
    }
  };

  const handleSpeciesDelete = () => {
    setAnimalSpecies("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    navigate("/community");
  };

  const handleSubmit = async () => {
    if (!animalSpecies || !title.trim() || !content.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "dto",
      new Blob([JSON.stringify({ animalSpecies, title, content })], {
        type: "application/json",
      })
    );
    if (file) {
      formData.append("file", file);
    }

    const token = sessionStorage.getItem("token")?.replace(/^"|"$/g, ""); // 따옴표 제거
    console.log("전송 토큰:", token);

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/community/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("등록 성공:", response.data);
      alert("글이 성공적으로 등록되었습니다.");
      queryClient.invalidateQueries(["community"] as any);




      navigate("/community");
    } catch (error: any) {
      console.error("등록 실패:", error.response ? error.response.data : error.message);
      alert("등록 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5 font-ysabeau">
        글쓰기
      </h1>
      <div className="w-full max-w-2xl bg-white rounded-lg p-6 space-y-4 shadow-none">
        {/* 종 입력 */}
        <div>
          <label className="text-[#D8E6BE] font-bold">종 입력</label>
          <input
            type="text"
            placeholder="종을 입력하세요"
            onKeyPress={handleSpeciesKeyPress}
            className="w-full p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] mt-2"
            disabled={!!animalSpecies}
          />
          {animalSpecies && (
            <div className="mt-2 inline-flex items-center bg-[#D8E6BE] text-black px-2 py-1 rounded-md shadow-sm">
              <span className="text-sm">{animalSpecies}</span>
              <button
                className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                onClick={handleSpeciesDelete}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* 제목 입력 */}
        <div>
          <label className="text-[#D8E6BE] font-bold">제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] mt-2"
          />
        </div>

        {/* 내용 입력 */}
        <div>
          <label className="text-[#D8E6BE] font-bold">내용</label>
          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] mt-2"
            rows={6}
          />
        </div>

        {/* 파일 첨부 */}
        <div>
          <label className="text-[#D8E6BE] font-bold">파일 첨부</label>
        </div>
        <div className="mt-2">
          <input type="file" onChange={handleFileChange} />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={handleCancel}
            className="p-3 bg-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-400 transition"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="p-3 bg-[#5CA157] text-white font-bold rounded-md hover:bg-[#4A8B42] transition"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPost;
