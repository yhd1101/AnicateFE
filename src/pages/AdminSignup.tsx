import { useAdminSignupMutation } from "@/services/useAdminSignupMutation";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const AdminSignup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // 이메일
  const [password, setPassword] = useState(""); // 비밀번호
  const [name, setName] = useState(""); // 이름

  const adminSignupMutation = useAdminSignupMutation(); // React Query 훅

  const handleCancel = () => {
    navigate("/admin/login"); // 취소 시 메인 페이지로 이동
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 회원가입 데이터 준비
    const adminData = {
      email,
      password,
      name,
    };

    // 회원가입 요청
    adminSignupMutation.mutate(adminData, {
      onSuccess: () => {
        alert("회원가입 성공!");
        navigate("/"); // 성공 시 메인 페이지로 이동

      },
      onError: (error) => {
        console.log(adminData,"데이터")
        console.error("회원가입 실패:", error.message);
        alert("회원가입 실패: " + error.message);
      },
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5">
        관리자 회원가입
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
            className="w-full p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] mt-2"
            required
          />
        </div>

        {/* 이름 입력 */}
        <div>
          <label className="text-[#5CA157] font-bold">이름</label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] mt-2"
            required
          />
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
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
