import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';

import { KakaoRedirection } from './pages/KakaoRedirection.tsx';
import Community from './pages/Community.tsx';
import CommunityPost from './pages/CommunityPost.tsx';
import CommunityDetail from './pages/CommunityDetail.tsx';
import Mypage from './pages/MyPage.tsx';
import Information from './pages/Information.tsx';
import InformationDetail from './pages/InformationDetail.tsx';
import Hospital from './pages/Hospital.tsx';

type routeElement = {
  path: string;
  element: React.ReactNode;
  errorElement?: React.ReactNode;
  children?: { path: string; element: React.ReactNode }[];
};

const routes: routeElement[] = [
  {
    path: '/',
    element: <HomePage />,
    
  },
  {
    path: '/community',
    element: <Community/>
  },
  {
    path: '/community/post',
    element: <CommunityPost/>
  },
  {
    path: '/community/:id', // 오타 수정
    element: <CommunityDetail />
  },
  {
    path: '/mypage',
    element: <Mypage/>
  },
  {
    path:'/information',
    element: <Information/>
  },
  {
    path: '/information/:id', // 오타 수정
    element: <InformationDetail />
  },
  {
    path: '/hospital',
    element:<Hospital/>
  },
  {
    path: '/api/auth/kakao/callback',
    element: <KakaoRedirection />,
  },
  
];

export const router = createBrowserRouter(routes);
