import React, { useState } from "react";


import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import InformationSearch from "@/components/search/InformationSearch";
import Informations from "@/components/Information/Informations";
import { useFetchInformation } from "@/services/useFetchInformation";


const Information: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [speciesName, setSpeciesName] = useState("");
  const [breedName, setBreedName] = useState("");

  const { data, isLoading, isError, error } = useFetchInformation(currentPage, speciesName, breedName);

  const handleSearch = (searchSpeciesName: string, searchBreedName: string) => {
    setSpeciesName(searchSpeciesName);
    setBreedName(searchBreedName);
    setCurrentPage(1); // 검색 시 페이지를 1로 초기화
  };

  const posts = data?.data || [];
  const meta = data?.meta;

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error instanceof Error ? error.message : "알 수 없는 오류"}</div>;

  return (
    <>
      <Header />
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5 font-ysabeau">
          반려동물 정보
        </h1>
        <div className="w-full">
          <InformationSearch onSearch={handleSearch} />
        </div>
        <div className="flex flex-col items-end gap-6 w-full max-w-2xl mt-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/information/${post.id}`)}
                className="w-full cursor-pointer"
              >
                <Informations
                  breeName={post.breedName}
                  age={post.age}
                  speciesName={post.speciesName}
                  weight={post.weight}
                  height={post.height}
                  imageUrl={post.picture}
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

export default Information;
