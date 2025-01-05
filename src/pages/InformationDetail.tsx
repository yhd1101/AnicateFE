import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchCommunityDetail } from "@/services/useFetchCommunityDetail"; // 훅 임포트
import { useUser } from "@/context/UserContext"; // UserContext 임포트
import axios from "axios";
import { useCreateComment } from "@/services/useCreateComment"; // 댓글 생성 훅 임포트
import Community from "./Community";
import { useFetchInformationDetail } from "@/services/useFetchInformationDetail";
import Informations from "@/components/Information/Informations";
import Header from "@/components/Header";

const InformationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 ID를 가져옴
  console.log(id);
  // 페이지 로드 시 userId 가져오기 (sessionStorage에서 불러오기)
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("id");
  }, []);


  // API로부터 데이터 불러오기
  const { data, isLoading, isError, error } = useFetchInformationDetail(id!);
  const post = data?.data
  console.log("post console ",post?.age)


 
  if (isLoading) return <div>로딩 중...</div>; // 로딩 상태일 때
  if (isError) return <div>에러 발생: {error instanceof Error ? error.message : "알 수 없는 오류"}</div>; // 에러 발생시



  return (
    <>
    <Header/>
    <div className="flex flex-col items-center">

        <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5 font-ysabeau">
                반려동물 정보
        </h1>
        <Informations
            breeName={post.breedName}
            age={post.age}
            speciesName={post.speciesName}
            weight={post.weight}
            height={post.height}
            imageUrl={post.picture}
        />
         <div className="flex flex-col items-start gap-6 w-full max-w-4xl mt-8 px-4">
          <div className="mt-4 flex">
            <h3 className="text-[#5CA157] font-bold text-3xl">양육 가이드</h3>
          </div>
          <span>
            {post.guide}
          </span>

          <div className="mt-4 flex">
            <h3 className="text-[#5CA157] font-bold text-3xl">특징</h3>
          </div>
          <span>
            {post.description}
          </span>
        </div>
        
        
    </div>
    </>
    
  );
};

export default InformationDetail;
