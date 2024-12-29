import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchCommunityDetail } from "@/services/useFetchCommunityDetail"; // 훅 임포트
import { useUser } from "@/context/UserContext"; // UserContext 임포트
import axios from "axios";
import { useCreateComment } from "@/services/useCreateComment"; // 댓글 생성 훅 임포트

const CommunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 ID를 가져옴
  const { userId } = useUser(); // 로그인한 사용자 정보 가져오기
  const [comment, setComment] = useState(""); // 댓글 입력 상태
  const [animalSpecies, setAnimalSpecies] = useState(""); // 종 입력 상태

  // API로부터 데이터 불러오기
  const { data, isLoading, isError, error } = useFetchCommunityDetail(id!);

  // 댓글 생성 API 호출 (useCreateComment 사용)
  const { mutate: createComment } = useCreateComment();

  // 댓글 입력 처리
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  // 종 입력 처리
  const handleSpeciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimalSpecies(e.target.value);
  };

  // 댓글 제출 처리
  const handleCommentSubmit = async () => {
    if (!comment) {
      alert("댓글을 입력해주세요.");
      return;
    }

    // 세션에서 토큰 가져오기
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const sanitizedToken = token.replace(/"/g, ""); // 토큰에서 따옴표 제거

      // 댓글 생성 API 호출 (id를 communityId로 사용)
      const response = await axios.post(
        `http://localhost:8080/api/comments/${id}`, // communityId를 URL에 넣음
        { content: comment }, // 댓글 내용
        {
          headers: {
            Authorization: `Bearer ${sanitizedToken}`, // Authorization 헤더에 토큰 추가
          },
        }
      );
      alert("댓글이 등록되었습니다!");

      // 댓글 등록 후 처리 (예: 댓글 리스트 갱신 등)
      console.log("댓글 등록 성공:", response.data);
      setComment(""); // 댓글 입력 초기화
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  // 수정 및 삭제 클릭 처리
  const handleEditCommunity = () => {
    console.log(`게시글 ${id} 수정`);
    // 수정 로직 작성
  };

  const handleDeleteCommunity = () => {
    console.log(`게시글 ${id} 삭제`);
    // 삭제 로직 작성
  };

  const handleEditComment = (commentId: number) => {
    console.log(`댓글 ${commentId} 수정`);
    // 수정 로직 작성
  };

  const handleDeleteComment = (commentId: number) => {
    console.log(`댓글 ${commentId} 삭제`);
    // 삭제 로직 작성
  };

  if (isLoading) return <div>로딩 중...</div>; // 로딩 상태일 때
  if (isError) return <div>에러 발생: {error instanceof Error ? error.message : "알 수 없는 오류"}</div>; // 에러 발생시

  const community = data?.data.community;
  const comments = data?.data.comment.data; // 댓글 리스트

  return (
    <div className="flex flex-col items-center">
      {/* 이미지가 텍스트 위에 오도록 변경 */}
      {community?.picture && (
        <img
          src={community.picture}
          alt="게시글 이미지"
          className="w-full h-auto max-w-[600px] max-h-[600px] object-cover mt-6 mb-5"
        />
      )}

      <div className="w-full max-w-2xl bg-white rounded-lg p-3 space-y-4 shadow-none">
        {/* 게시글 상세 내용 표시 */}
        <div className="flex items-center mt-4 space-x-2">
          {community?.profileImg && (
            <img
              src={community.profileImg}
              alt="프로필 이미지"
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          {community?.name && <p className="text-sm text-gray-700">{community.name}</p>}
        </div>

        <div className="border-t-2 border-gray-300 mt-2" />
        {community?.title && <h3 className="text-2xl font-bold mt-4">{community.title}</h3>}
        
        {/* community.createdAt을 가져와서 년, 월, 일만 출력 */}
        {community?.createdAt && (
          <p className="text-xs text-gray-500">
            {community.createdAt.split("T")[0]}
          </p>
        )}

        {community?.content && <p className="text-xl mt-3">{community.content}</p>}

        {community?.animalSpecies && (
          <div className="mt-2 inline-flex items-center bg-[#D8E6BE] text-black px-2 py-1 rounded-md shadow-sm">
            <span className="text-sm">{community.animalSpecies}</span>
          </div>
        )}

        {/* 수정 및 삭제 버튼 */}
        {userId && (
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={handleEditCommunity}
              className="text-gray-500 hover:text-gray-700"
            >
              수정
            </button>
            <button
              onClick={handleDeleteCommunity}
              className="text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </div>
        )}

        {/* 댓글 입력창 */}
        <textarea
          className="w-full mt-4 p-3 border border-gray-300 rounded-md resize-none"
          placeholder="댓글을 입력하세요..."
          value={comment}
          onChange={handleCommentChange}
        />

        {/* 댓글 등록 버튼 */}
        <div className="flex justify-end mt-6 w-full">
          <button
            onClick={handleCommentSubmit}
            className="bg-[#5CA157] text-white font-bold py-2 px-4 rounded-md hover:bg-[#4A8B42]"
          >
            댓글 등록
          </button>
        </div>

        {/* 댓글 리스트 */}
        {comments?.map((comment) => (
          <div key={comment.id} className="mt-6 w-full">
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <div className="flex items-center space-x-2">
                {comment.profileImg && (
                  <img
                    src={comment.profileImg}
                    alt="프로필 이미지"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                {comment.name && <p className="text-sm text-gray-700">{comment.name}</p>}
              </div>

              <div className="ml-auto flex items-center space-x-2">
                <span>{comment.createdAt.split("T")[0]}</span>
                {userId && (
                  <>
                    <span
                      onClick={() => handleEditComment(comment.id)}
                      className="cursor-pointer hover:text-gray-700"
                    >
                      수정
                    </span>
                    <span
                      onClick={() => handleDeleteComment(comment.id)}
                      className="cursor-pointer hover:text-red-500"
                    >
                      삭제
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-800 mt-2">{comment.content}</p>
            <div className="border-t-2 border-gray-300 mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityDetail;
