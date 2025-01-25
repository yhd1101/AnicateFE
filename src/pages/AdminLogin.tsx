import { useAdminLoginMutation } from "@/services/useAdminLoginMutation";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // 이메일
  const [password, setPassword] = useState(""); // 비밀번호

  const loginMutation = useAdminLoginMutation(); // useMutation 훅 호출

  const handleSignup = () => {
    navigate("/admin/signup"); // 회원가입 페이지로 이동
  };

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

  
    loginMutation.mutate(
      { email, password }, // 로그인 데이터 전달
      {
        onSuccess: () => {
          navigate("/"); // 로그인 성공 시 대시보드로 이동
        },
        onError: (error: any) => {
          alert(error.response?.data?.message || "로그인에 실패했습니다.");
        },
      }
    );
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(); // Enter 키를 누르면 로그인 요청
    }
  };
  


  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5">
        관리자로 들어가기
      </h1>
      <div className="w-full max-w-2xl bg-white rounded-lg p-6 space-y-4 shadow-none">
        {/* 이메일 입력 */}
        <div>
          <label className="text-[#5CA157] font-bold">이메일</label>
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown} // Enter 키 이벤트 처리

            className="w-full p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] mt-2"
            required
          />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label className="text-[#5CA157] font-bold">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown} // Enter 키 이벤트 처리
            className="w-full p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] mt-2"
            required
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={handleSignup}
            className="p-3 bg-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-400 transition"
          >
            회원가입
          </button>
          <button
            onClick={handleSubmit}
            className="p-3 bg-[#5CA157] text-white font-bold rounded-md hover:bg-[#4A8B42] transition"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
