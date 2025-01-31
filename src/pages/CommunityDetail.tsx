import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchCommunityDetail } from "@/services/useFetchCommunityDetail"; // 훅 임포트
import axios from "axios";
import { useCreateComment } from "@/services/useCreateComment"; // 댓글 생성 훅 임포트

import Header from "@/components/Header";
import LikeButton from "@/components/Button/LikeButton";
import { useLikeMutation } from "@/services/useLikeMutation";
import { useLikeDeleteMutation } from "@/services/useLikeDeleteMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteCommunityPostMutation } from "@/services/useDeleteCommunityPostMutation";
import { useUpdateCommentMutation } from "@/services/useCommunityUpdate";
import { useDeleteCommentMutation } from "./useCommentDelete";

const CommunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 ID를 가져옴
  const [comment, setComment] = useState(""); // 댓글 입력 상태
  const [liked, setLiked] = useState(false); // 좋아요 상태 추가
  const [likeCount, setLikeCount] = useState(0); // 좋아요 수 상태
  const [userId, setUserId] = useState<string | null>(null); // userId 상태
  const queryClient = useQueryClient();

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
const [editedContent, setEditedContent] = useState<string>("");

const handleEditComment = (commentId: number, content: string) => {
  setEditingCommentId(commentId);
  setEditedContent(content);
};

// 댓글 수정 취소
const handleCancelEdit = () => {
  setEditingCommentId(null);
  setEditedContent("");
};

  const { mutate: likePost } = useLikeMutation();
  const { mutate: likeDelete} = useLikeDeleteMutation();

  const { mutate: deletePost} = useDeleteCommunityPostMutation();
  const navigate = useNavigate();

  const handleDelete = (postingId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deletePost(postingId);
      navigate("/community")
    }
  };

  // 페이지 로드 시 userId 가져오기 (sessionStorage에서 불러오기)
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("id");
    if (storedUserId) {
      setUserId(storedUserId); // sessionStorage에서 userId 불러와 상태 업데이트
    }
  }, []);


  // API로부터 데이터 불러오기
  const { data, isLoading, isError, error } = useFetchCommunityDetail(id!);
  console.log("sda", data);

  const { mutate: updateComment } = useUpdateCommentMutation(id!);

  const { mutate: deleteComment } = useDeleteCommentMutation(id!)

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteComment(commentId);
      queryClient.invalidateQueries(["communityDetail", id]);
    }
  };

  const handleUpdateComment = (commentId: number) => {
    updateComment(
      { commentId, content: editedContent },
      {
        onSuccess: (updatedComment) => {
          alert("댓글이 수정되었습니다.");
          setEditingCommentId(null); // 수정 모드 종료
  
          // ✅ 강제로 데이터 다시 불러오기 (필요한 경우)
          queryClient.invalidateQueries(["communityDetail", id]);
        },
      }
    );
  };
  

  console.log(data);


  // 댓글 입력 처리
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  // 종 입력 처리
  const handleSpeciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimalSpecies(e.target.value);
  };

 

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }
  
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    try {
      const sanitizedToken = token.replace(/"/g, "");
  
      // 서버로 댓글 등록 요청
      const response = await axios.post(
        `http://localhost:8080/api/comments/${id}`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${sanitizedToken}`,
          },
        }
      );

      console.log("댓글 등록 성공 응답:", response.data.data);
      const newComment = response.data.data; // 서버에서 반환된 댓글 데이터
      alert("댓글이 등록되었습니다!");
      setComment(""); // 입력 초기화
  
      // React Query 캐시 업데이트
      queryClient.setQueryData(["communityDetail", id], (oldData: any) => {
        if (!oldData) return oldData;
      
        const updatedComments = [
          ...oldData.data.comment, // 기존 댓글
          {
            id: newComment.id,
            communityId: newComment.communityId,
            userId: newComment.userId,
            name: newComment.name || "익명 사용자",
            profileImg: newComment.profileImg || "",
            content: newComment.content,
            canEdit: newComment.canEdit || false,
            createdAt: newComment.createdAt || new Date().toISOString(),
            updatedAt: newComment.updatedAt || new Date().toISOString(),
          },
        ];
      
      
        console.log("업데이트된 캐시 데이터:", updatedComments);
      
        return {
          ...oldData,
          data: {
            ...oldData.data,
            comment: updatedComments,
          },
        };
      });
      
    } catch (error: any) {
      console.error("댓글 등록 실패:", error.response ? error.response.data : error.message);
      alert("댓글 등록에 실패했습니다.");
    }
  };
  

  // 수정 및 삭제 클릭 처리
  const handleEditCommunity = () => {
    console.log(`게시글 ${id} 수정`);
    navigate(`/community/update/${id}`)
    // 수정 로직 작성
  };



  // if (isLoading) return <div>로딩 중...</div>; // 로딩 상태일 때
  // if (isError) return <div>에러 발생: {error instanceof Error ? error.message : "알 수 없는 오류"}</div>; // 에러 발생시

  const community = data?.data.community;
  const comments = data?.data.comment // 댓글 리스트
  console.log("dsd", comments);

  useEffect(() => {
    if (data?.data?.community) {
      const { liked: initialLiked, likeCount: initialLikeCount } = data.data.community;
      setLiked(initialLiked); // 초기 liked 상태 설정
      setLikeCount(initialLikeCount); // 초기 likeCount 설정
    }
  }, [data]);



  const handleLike = () => {
    if (!id) return;

    if (liked) {
      // 좋아요 취소 API 호출
      likeDelete(id, {
        onSuccess: () => {
          setLiked(false); // 좋아요 상태를 false로 변경
          setLikeCount((prev) => prev - 1); // 좋아요 수 감소

          // React Query 캐시 업데이트
          queryClient.setQueryData(["communityDetail", id], (oldData: any) => {
            if (oldData) {
              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  community: {
                    ...oldData.data.community,
                    liked: false,
                    likeCount: oldData.data.community.likeCount - 1,
                  },
                },
              };
            }
            return oldData;
          });
        },
      });
    } else {
      // 좋아요 API 호출
      likePost(id, {
        onSuccess: () => {
          setLiked(true); // 좋아요 상태를 true로 변경
          setLikeCount((prev) => prev + 1); // 좋아요 수 증가

          // React Query 캐시 업데이트
          queryClient.setQueryData(["communityDetail", id], (oldData: any) => {
            if (oldData) {
              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  community: {
                    ...oldData.data.community,
                    liked: true,
                    likeCount: oldData.data.community.likeCount + 1,
                  },
                },
              };
            }
            return oldData;
          });
        },
      });
    }
  };

  return (
    <>
    <Header/>
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

          <div className="flex justify-end space-x-4 mt-4">
            <LikeButton onClick={handleLike} liked={liked} likeCount={community?.likeCount}/>
            {userId && community?.userId === Number(userId) &&  (
              <>
                <button
                  onClick={handleEditCommunity}
                  className="text-gray-500 hover:text-gray-700"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(community.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </>
          
                )}
          </div>
    

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
        {comments?.length > 0 &&
          comments.map((comment) => (
            <div key={comment.id} className="mt-6 w-full">
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <div className="flex items-center space-x-2">
                  {comment?.profileImg && (
                    <img
                      src={comment.profileImg}
                      alt="프로필 이미지"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  {comment?.name && <p className="text-sm text-gray-700">{comment.name}</p>}
                </div>

                <div className="ml-auto flex items-center space-x-2">
                  <span>{comment?.createdAt?.split("T")[0]}</span>
                  {userId && comment.userId === Number(userId) && (
                    <>
                      {editingCommentId === comment.id ? (
                        <>
                          <span
                            onClick={handleCancelEdit}
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                          >
                            취소
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            onClick={() => handleEditComment(comment.id, comment.content)}
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
                    </>
                  )}
                </div>
              </div>

              {/* ✅ 수정 모드일 때 input 표시 */}
              <div className="flex items-center mt-2">
                {editingCommentId === comment.id ? (
                  <>
                    <input
                      type="text"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                    />
                    <button
                       onClick={() => handleUpdateComment(comment.id)}
                      className="ml-2 px-3 py-1 bg-[#5CA157] text-white rounded-md hover:bg-[#4A8B42]"
                    >
                      수정하기
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-800">{comment?.content}</p>
                )}
              </div>

              <div className="border-t-2 border-gray-300 mt-4" />
            </div>
          ))}

      </div>
    </div>
    </>
    
  );
};

export default CommunityDetail;
