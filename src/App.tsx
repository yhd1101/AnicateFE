import { memo } from 'react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Footer from './components/Footer';
import Header from './components/Header';
import { UserProvider } from './context/UserContext';


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
        <Header />
        <RouterProvider router={router} />
      </UserProvider>
    </QueryClientProvider>
    <Footer />
  </RecoilRoot>
));

App.displayName = 'App';

export default App;
