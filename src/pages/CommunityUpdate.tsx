import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useFetchCommunityDetail } from "@/services/useFetchCommunityDetail";
import { useQueryClient } from "@tanstack/react-query";

const CommunityUpdate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // URL에서 ID를 가져옴
  const queryClient = useQueryClient(); // ✅ React Query Client 가져오기


  // ✅ 기존 데이터 불러오기
  const { data, isLoading, isError, error } = useFetchCommunityDetail(id!);
  const community = data?.data?.community;

  // ✅ 상태값 (기존 값으로 초기화)
  const [animalSpecies, setAnimalSpecies] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(""); // 기존 이미지 URL

  // ✅ 기존 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (community) {
      setAnimalSpecies(community.animalSpecies || "");
      setTitle(community.title || "");
      setContent(community.content || "");
      setPreviewImage(community.picture || ""); // 기존 이미지 URL 저장
    }
  }, [community]);

  // ✅ 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile)); // 새 이미지 미리 보기
    }
  };

  // ✅ 취소 버튼 (기존 상세 페이지로 이동)
  const handleCancel = () => {
    navigate(`/community/${id}`);
  };

  // ✅ 업데이트 요청
  const handleSubmit = async () => {
    if (!animalSpecies || !title.trim() || !content.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "dto",
      new Blob(
        [
          JSON.stringify({
            animalSpecies,
            title,
            content,
            picture: file ? "" : previewImage, // 새 파일이 없으면 기존 URL 유지
          }),
        ],
        { type: "application/json" }
      )
    );

    if (file) {
      formData.append("file", file);
    }

    const token = sessionStorage.getItem("token")?.replace(/^"|"$/g, ""); // 따옴표 제거
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/community/post/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("수정 성공:", response.data);
      alert("글이 성공적으로 수정되었습니다.");
      queryClient.invalidateQueries(["communityDetail", id]);
      navigate(`/community/${id}`);
    } catch (error: any) {
      console.error("수정 실패:", error.response ? error.response.data : error.message);
      alert("수정 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error instanceof Error ? error.message : "알 수 없는 오류"}</div>;

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

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5">글 수정</h1>
      <div className="w-full max-w-2xl bg-white rounded-lg p-6 space-y-4 shadow-none">
        
        {/* ✅ 종 입력 */}
     {/* ✅ 종 입력 (기존 값이 있으면 보여주고 수정 불가) */}
        <div>
          <label className="text-[#D8E6BE] font-bold">종 입력</label>

          {/* ✅ 기존 값이 있으면 태그로 표시 */}
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

        {/* ✅ 제목 입력 */}
        <div>
          <label className="text-[#D8E6BE] font-bold">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] mt-2"
          />
        </div>

        {/* ✅ 내용 입력 */}
        <div>
          <label className="text-[#D8E6BE] font-bold">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] mt-2"
            rows={6}
          />
        </div>

        {/* ✅ 파일 첨부 & 미리 보기 */}
        <div>
          {/* <label className="text-[#D8E6BE] font-bold"></label> */}
          <input type="file" onChange={handleFileChange} className="mt-2" />
          
          {/* ✅ 기존 이미지 미리 보기 */}
          {previewImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">현재 이미지:</p>
              <img src={previewImage} alt="기존 이미지" className="w-32 h-32 rounded-md object-cover mt-2" />
            </div>
          )}
        </div>

        {/* ✅ 버튼 */}
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={handleCancel} className="p-3 bg-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-400 transition">
            취소
          </button>
          <button onClick={handleSubmit} className="p-3 bg-[#5CA157] text-white font-bold rounded-md hover:bg-[#4A8B42] transition">
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityUpdate;
