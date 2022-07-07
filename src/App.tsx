import {Suspense} from 'react';
import {Router, ReactLocation, Outlet} from '@tanstack/react-location';
import {QueryClient, QueryClientProvider} from 'react-query';
import {routes} from './routes';

const location = new ReactLocation();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      retryOnMount: false,
      staleTime: Infinity,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center" />
      }>
      <Router location={location} routes={routes}>
        <Outlet />
      </Router>
    </Suspense>
  </QueryClientProvider>
);

export default App;
