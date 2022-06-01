import React from 'react';
import {Router, ReactLocation, Outlet} from '@tanstack/react-location';
import {QueryClient, QueryClientProvider} from 'react-query';
import {routes} from './Router';

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
  <Router location={location} routes={routes}>
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  </Router>
);

export default App;
