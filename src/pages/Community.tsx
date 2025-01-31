import React, { useState } from "react";
import CommunityPost from "@/components/Community/CommunityPost";
import { useFetchCommunity } from "@/services/useFetchCommunity";
import CommunitySearchSection from "@/components/search/ CommunitySearchSection";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Community: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [animalSpecies, setAnimalSpecies] = useState("");

  const { data, isLoading, isError, error } = useFetchCommunity(currentPage, keyword, animalSpecies);

  const handleSearch = (searchKeyword: string, searchAnimalSpecies: string) => {
    setKeyword(searchKeyword);
    setAnimalSpecies(searchAnimalSpecies);
    setCurrentPage(1);
  };

  const handleWritePost = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("로그인하셔야 합니다.");
      return;
    }

    navigate("/community/post");
  };

  const posts = data?.data || [];
  const meta = data?.meta;

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error instanceof Error ? error.message : "알 수 없는 오류"}</div>;

  return (
    <>
      <Header/>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5 font-ysabeau">
          커뮤니티
        </h1>
        <div className="w-full">
          <CommunitySearchSection onSearch={handleSearch} />
        </div>
        <div className="flex flex-col items-end gap-6 w-full max-w-2xl min-h-[650px] mt-8">
          <div className="mt-4 flex">
            <button
              className="p-1 bg-[#5CA157] text-white font-bold rounded-md hover:bg-[#4A8B42] transition"
              onClick={handleWritePost}
            >
              글쓰기
            </button>
          </div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/community/${post.id}`)} // 게시글 클릭 시 상세 페이지로 이동
                className="w-full cursor-pointer" // 클릭 가능 설정
              >
                <CommunityPost
                  tag={post.animalSpecies}
                  title={post.title}
                  content={post.content}
                  imageUrl={post.picture}
                  commentCount={post.commentCount}
                  likeCount={post.likeCount}
                />
              </div>
            ))
          ) : (
            <div>게시글이 없습니다.</div>
          )}
        </div>
        {meta && (
          <div className="flex gap-2 mt-6 mb-3">
            {Array.from({ length: meta.totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1 ? "bg-[#5CA157] text-white" : "bg-white text-gray-600"
                } border hover:bg-[#4A8B42]`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
   
  );
};

export default Community;
