import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';

import { KakaoRedirection } from './pages/KakaoRedirection.tsx';
import Community from './pages/Community.tsx';
import CommunityPost from './pages/CommunityPost.tsx';
import CommunityDetail from './pages/CommunityDetail.tsx';

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
    path: '/api/auth/kakao/callback',
    element: <KakaoRedirection />,
  },
  
];

export const router = createBrowserRouter(routes);
