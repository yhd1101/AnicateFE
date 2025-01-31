import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateChatRoomMutation } from "@/services/useCreateChatRoomMutation";

const ChatRoomPost: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(""); // 채팅방 제목
  const [content, setContent] = useState(""); // 채팅방 설명

  const createChatRoomMutation = useCreateChatRoomMutation(); // ✅ 채팅방 생성 훅 사용

  // ✅ 채팅방 생성 핸들러
  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    createChatRoomMutation.mutate(
      {
        roomName: title,
        description: content,
      },
      {
        onSuccess: () => {
          alert("채팅방이 성공적으로 생성되었습니다!");
          navigate("/chatlist"); // ✅ 채팅방 목록 페이지로 이동
        },
        onError: (error) => {
          alert(error.message || "채팅방 생성에 실패했습니다.");
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5 font-ysabeau">
        채팅방 생성하기
      </h1>
      <div className="w-full max-w-2xl bg-white rounded-lg p-6 space-y-4 shadow-none">
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
            placeholder="반려 동물의 주요 증상 등을 설명하는 내용을 입력해주세요.
정확하게 입력해야 원활한 상담 및 빠른 답변이 가능합니다."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] mt-2"
            rows={6}
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => navigate("/chat")}
            className="p-3 bg-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-400 transition"
          >
            취소
          </button>
          <button
            onClick={handleSubmit} // ✅ 채팅방 생성 API 호출
            className="p-3 bg-[#5CA157] text-white font-bold rounded-md hover:bg-[#4A8B42] transition"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPost;
