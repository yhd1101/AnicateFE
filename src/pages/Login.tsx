import { RiKakaoTalkFill } from 'react-icons/ri';
import { IoIosClose } from 'react-icons/io';
import { loginModalState } from '@/recoil/atoms/loginState';
import { useRecoilState } from 'recoil';
import { useUser } from '@/context/UserContext'; // UserContext 임포트

export const Login = () => {
  const [, setLoginModal] = useRecoilState(loginModalState);
  const { setUserInfo } = useUser(); // UserContext에서 setUserInfo를 가져옴

  const onClickCloseModal = () => {
    setLoginModal((prevState) => ({ ...prevState, isModalOpen: !prevState.isModalOpen }));
  };

  const onClickKakaoLogin = () => {
    const link = `https://kauth.kakao.com/oauth/authorize?client_id=${
      import.meta.env.VITE_KAKAO_REST_API_KEY
    }&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;

    window.location.href = link; // 카카오 인증 페이지로 리디렉션
  };

  return (
    <div className="flex h-fit w-full flex-col items-center">
      <div className="flex w-full flex-row items-center justify-around border-b border-gray-300 py-2.5">
        <div className="ml-[8%] w-[90%] text-center text-[20px] font-bold">로그인</div>
        <div onClick={onClickCloseModal} className="mt-[1%] cursor-pointer text-[26px] font-bold">
          <IoIosClose />
        </div>
      </div>
      <span className="px-3 py-[10%] text-center text-[17px] font-bold">로그인이 필요한 서비스입니다.</span>
      <div className="m-0 flex flex-col pb-[5%]">
        <button
          className="mt-2.5 flex h-10 w-[55vh] cursor-pointer items-center justify-center rounded-md bg-[#f7e600] font-bold sm:w-[40vh] md:w-[20vh] lg:w-[30vh]"
          onClick={onClickKakaoLogin}
        >
          <div className="mr-2 text-[20px]">
            <RiKakaoTalkFill />
          </div>
          <div className="text-[15px] font-bold">카카오 로그인</div>
        </button>
      </div>
    </div>
  );
};
