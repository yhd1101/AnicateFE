import { memo } from 'react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';  // 라우터 설정
import Footer from './components/Footer';
import Header from './components/Header';
import { UserProvider } from './context/UserContext';
import { SearchProvider } from './context/SearchContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const App = memo(() => (
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
          <SearchProvider>
          <div className="min-h-screen flex flex-col">
      
            <RouterProvider router={router} />
        
          </div>
          </SearchProvider>
      </UserProvider>
      <Footer />
    </QueryClientProvider>
  </RecoilRoot>
));

App.displayName = 'App';

export default App;
