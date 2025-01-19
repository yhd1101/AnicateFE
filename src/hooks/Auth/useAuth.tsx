import { loginAtom, loginState, logoutAtom, updateTokenAtom } from '@/recoil/atoms/loginState';
import { useNavigate } from 'react-router-dom';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { Cookies } from 'react-cookie';
import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';

// export const useLogin = () => {
//   const tokenLoadable = useRecoilValueLoadable(loginAtom);
//   const setToken = useSetRecoilState(updateTokenAtom);
//   const setIsLogin = useSetRecoilState(loginState);
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (tokenLoadable.state === 'hasValue') {
//       const fetchedToken = tokenLoadable.contents;
//       setToken(fetchedToken);
//       setIsLogin((prevState) => ({ ...prevState, isLogin: true }));
//       navigate('/');
//     } else if (tokenLoadable.state === 'hasError') {
//       alert('로그인에 실패하였습니다. 다시 시도해주세요.');
//       console.log(tokenLoadable);
//       navigate('/');
//     }
//   }, [tokenLoadable, setToken]);
// };
// export const useLogin = () => {
//   const tokenLoadable = useRecoilValueLoadable(loginAtom);
//   const setToken = useSetRecoilState(updateTokenAtom);
//   const setIsLogin = useSetRecoilState(loginState);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (tokenLoadable.state === 'hasValue') {
//       const fetchedToken = tokenLoadable.contents;
//       setToken(fetchedToken);
//       setIsLogin({ isLogin: true });
//       navigate('/');
//     } else if (tokenLoadable.state === 'hasError') {
//       alert('로그인에 실패하였습니다. 다시 시도해주세요.');
//       navigate('/');
//     }
//   }, [tokenLoadable, setToken]);
// };


export const useLogin = () => {
  const tokenLoadable = useRecoilValueLoadable(loginAtom);
  const setToken = useSetRecoilState(updateTokenAtom);
  const setIsLogin = useSetRecoilState(loginState);
  const { setUserInfo } = useUser(); // UserContext에서 setUserInfo를 가져옴
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenLoadable.state === 'hasValue') {
      const { accessToken, userId,role } = tokenLoadable.contents;  // accessToken과 userId 추출
      setToken(accessToken);  // 토큰 저장
      sessionStorage.setItem("id",userId);
      sessionStorage.setItem("role", role); // role 저장
      setIsLogin({ isLogin: true });

      console.log('로그인 성공, userId:', userId, "role" , role);  // userId를 콘솔에 찍기

      if (userId !== undefined) {
        setUserInfo({ userId, role });  // UserContext에 userId만 저장
        console.log('userId가 UserContext에 저장되었습니다:', userId, role);
      }

      navigate('/');
    } else if (tokenLoadable.state === 'hasError') {
      alert('로그인에 실패하였습니다. 다시 시도해주세요.');
      navigate('/');
    }
  }, [tokenLoadable, setToken, setIsLogin, setUserInfo, navigate]);
};


// export const useLogin = () => {
//   const tokenLoadable = useRecoilValueLoadable(updateTokenAtom);
//   const setToken = useSetRecoilState(updateTokenAtom);
//   const setIsLogin = useSetRecoilState(loginState);
//   const { setUserInfo } = useUser(); // UserContext에서 setUserInfo를 가져옴
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (tokenLoadable.state === 'hasValue') {
//       const { accessToken, userId } = tokenLoadable.contents; // accessToken과 userId 추출
//       setToken(accessToken); // 토큰 저장
//       setIsLogin({ isLogin: true });

//       // 로그인 성공 시, userId를 sessionStorage에 저장
//       if (userId !== undefined) {
//         sessionStorage.setItem('userId', userId); // userId를 sessionStorage에 저장
//         setUserInfo({ userId });
//         console.log('userId가 UserContext에 저장되었습니다:', userId);
//       }

//       navigate('/');
//     } else if (tokenLoadable.state === 'hasError') {
//       alert('로그인에 실패하였습니다. 다시 시도해주세요.');
//       navigate('/');
//     }
//   }, [tokenLoadable, setToken, setIsLogin, setUserInfo, navigate]);
// };


export const useLogout = (): (() => void) => {
  const tokenLoadable = useRecoilValueLoadable(logoutAtom);
  const setIsLogin = useSetRecoilState(loginState);
  const setToken = useSetRecoilState(updateTokenAtom);
  const navigate = useNavigate();

  return () => {
    if (tokenLoadable.state === 'hasValue') {
      setToken(null);
      setIsLogin({ isLogin: false });
      navigate('/');
    } else if (tokenLoadable.state === 'hasError') {
      alert('로그아웃에 실패하였습니다. 다시 시도해주세요.');
      navigate('/');
    }
  };
};




// export const useLogout = (): (() => void) => {
//   const tokenLoadable = useRecoilValueLoadable(logoutAtom);
//   const setIsLogin = useSetRecoilState(loginState);
//   const setToken = useSetRecoilState(logoutAtom);
//   const navigate = useNavigate();
//   const cookies = new Cookies();

//   return () => {
//     if (tokenLoadable.state === 'hasValue') {
//       setToken(null);
//       cookies.remove('refreshToken', { path: '/' });
//       setIsLogin((prevState) => ({ ...prevState, isLogin: false }));
//       navigate('/');
//     } else if (tokenLoadable.state === 'hasError') {
//       alert('로그아웃에 실패하였습니다. 다시 시도해주세요.');
//       navigate('/');
//     }
//   };
// };
