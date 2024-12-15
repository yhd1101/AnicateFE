import { createBrowserRouter } from 'react-router-dom';
import App from './App';

type routeElement = {
  path: string;
  element: React.ReactNode;
  errorElement?: React.ReactNode;
  children?: { path: string; element: React.ReactNode }[];
};

const routes: routeElement[] = [
  {
    path: '/',
    element: <App />,
  },
];

export const router = createBrowserRouter(routes);
