import { atom, DefaultValue, selector, useRecoilState } from 'recoil';

import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { CONFIG } from '../../../config';
// import { Cookies } from 'react-cookie';
import { LoginModalState, LoginState } from '@/types/type';
// import { useRefreshToken } from '@/queries/useRefreshToken';

export const loginState = atom<LoginState>({
  key: 'loginState',
  default: {
    isLogin: false,
  },
});

export const loginModalState = atom<LoginModalState>({
  key: 'loginModalState',
  default: {
    isModalOpen: false,
  },
});

const tokenBaseAtom = atom({
  key: 'tokenBaseAtom',
  default: sessionStorage.getItem(CONFIG.TOKEN_KEY)
    ? JSON.parse(sessionStorage.getItem(CONFIG.TOKEN_KEY) as string)
    : null,
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (newValue === null) {
          sessionStorage.removeItem(CONFIG.TOKEN_KEY);
        } else {
          sessionStorage.setItem(CONFIG.TOKEN_KEY, JSON.stringify(newValue));
        }
      });
    },
  ],
});

export const updateTokenAtom = selector({
  key: 'updateTokenAtom',
  get: ({ get }) => {
    const token = get(tokenBaseAtom);
    return token;
  },
  set: ({ set }, newValue) => {
    set(tokenBaseAtom, newValue);
  },
});


export const defaultClientAtom = selector({
  key: 'defaultClientAtom',
  get: ({ get }) => {
    const instance = axios.create({
      baseURL: CONFIG.DOMAIN,
      withCredentials: true,
    });

    instance.interceptors.request.use((config: any) => {
      const token = get(updateTokenAtom); // Access Token 가져오기
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config: originalRequest, response } = error;

        if (response?.data?.message === 'Expired AccessToken') {
          try {
            const refreshResponse = await axios.get('/api/auth/refresh', {
              withCredentials: true,
            });

            const newToken = refreshResponse.data.data.accessToken;
            if (newToken) {
              sessionStorage.setItem(CONFIG.TOKEN_KEY, JSON.stringify(newToken));
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return instance.request(originalRequest); // 요청 재시도
            }
          } catch (refreshError) {
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            sessionStorage.removeItem(CONFIG.TOKEN_KEY);
            window.location.href = '/';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return instance;
  },
});


// export const defaultClientAtom = selector({
//   key: 'defaultClientAtom',
//   get: ({ get }) => {
//     get(userUniqIdAtom);
//     const instance = axios.create({
//       baseURL: CONFIG.DOMAIN,
//       withCredentials: true,
//     });

//     instance.interceptors.request.use((config: any) => {
//       const token = get(updateTokenAtom);
//       if (token) {
//         config.headers.Authorization = `${token}`;
//       }
//       return config;
//     });

//     instance.interceptors.response.use(
//       (response) => {
//         return response;
//       },
//       async (error) => {
//         const refreshMutation = useRefreshToken();
//         const [, setToken] = useRecoilState(updateTokenAtom);
//         const { config: originalRequest, response } = error;
//         const { data } = response;
//         if (data.message === 'Expired AccessToken') {
//           try {
//             const newToken = await refreshMutation.mutateAsync();
//             setToken(newToken);
//             originalRequest.headers['Authorization'] = `${newToken}`;
//             return instance.request(originalRequest);
//           } catch (error) {
//             alert('예기치 못한 오류가 발생하였습니다. 다시 로그인해주세요.');
//             window.sessionStorage.removeItem(CONFIG.TOKEN_KEY);
//             window.location.href = `/`;
//           }
//         } else if (data.message === 'Expired RefreshToken') {
//           alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
//           window.sessionStorage.removeItem(CONFIG.TOKEN_KEY);
//           window.location.href = `/`;
//         }
//       },
//     );
//     return instance;
//   },
// });

export const userUniqIdAtom = selector({
  key: 'userUniqIdAtom',
  get: ({ get }) => {
    const token = get(updateTokenAtom);
    if (token) {
      const decodedToken = jwtDecode<JwtPayload & { userId: string }>(token);
      return decodedToken.userId;
    }
    return null;
  },
});

// export const loginAtom = selector({
//   key: 'loginAtom',
//   get: async ({ get }) => {
//     const client = get(defaultClientAtom);
//     const code = new URL(window.location.href).searchParams.get('code');
//     console.log(code);


//     if (!code) {
//       throw new Error('Authorization code not found.');
//     }

//     const { data } = await client.get(`api/auth/kakao/callback?code=${code}`);
//     console.log("data" +data);
//     const token = data.data.accessToken;
//     console.log(token);
//     const cookies = new Cookies();
//     cookies.set('refreshToken', data.data.refreshToken, { path: '/' });
//     return token;
//   },
//   set: ({ set }, newValue) => {
//     if (newValue instanceof DefaultValue) return;
//     set(updateTokenAtom, newValue as string);
//   },
// });


// export const loginAtom = selector({
//   key: 'loginAtom',
//   get: async () => {
//     const code = new URL(window.location.href).searchParams.get('code');
//     if (!code) {
//       throw new Error('Authorization code not found.');
//     }

//     try {
//       const { data } = await axios.get(`${CONFIG.DOMAIN}/api/auth/kakao/callback?code=${code}`);
//       if (!data?.data?.accessToken) {
//         throw new Error('Unexpected API response structure.');
//       }

//       return data.data.accessToken; // Access Token만 반환
//     } catch (error) {
//       console.error('로그인 실패:', error);
//       throw error;
//     }
//   },
// });

export const loginAtom = selector({
  key: 'loginAtom',
  get: async ({ get }) => {
    const client = get(defaultClientAtom);
    const code = new URL(window.location.href).searchParams.get('code');
    console.log('Authorization Code:', code);

    if (!code) {
      throw new Error('Authorization code not found.');
    }

    try {
      const { data } = await client.get(`/api/auth/kakao/callback?code=${code}`);
      console.log('API Response:', data);
      console.log('UserId', data?.data.userId);

      if (!data?.data?.accessToken) {
        throw new Error('Unexpected API response structure.');
      }

      // 여기서 userId를 반환
      return { accessToken: data.data.accessToken, userId: data.data.userId };
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error; // 에러를 호출한 쪽으로 전달
    }
  },
});


export const logoutAtom = selector({
  key: 'logoutAtom',
  get: async () => {
    try {
      await axios.post(`${CONFIG.DOMAIN}/api/auth/logout`);
      return null;
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  },
});


// export const logoutAtom = selector({
//   key: 'logoutAtom',
//   get: ({ get }) => {
//     const client = get(defaultClientAtom);
//     client.defaults.headers.Authorization !== undefined && client.post('/auth/logout');

//     return null;
//   },
//   set: ({ set }) => {
//     set(updateTokenAtom, null);
//   },
// });
