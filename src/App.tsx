import {Suspense} from 'react';
import {Router, ReactLocation, Outlet} from '@tanstack/react-location';
import {QueryClient, QueryClientProvider} from 'react-query';
import {BottomMenuButton} from '@/features/bottom-menu/components/BottomMenuButton';
import {routes} from './routes';
import {BottomMenuIcon} from './features/bottom-menu/components/BottomMenuIcon';
import {SvgIcon} from './components/Elements/SvgIcon';
import {BottomMenu} from './features/bottom-menu/components/BottomMenu';

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
        <div className="h-full">
          <div className="min-h-screen">
            <div className="isolate">
              <Outlet />
            </div>
            <BottomMenu />
          </div>
        </div>
      </Router>
    </Suspense>
  </QueryClientProvider>
);

export default App;
