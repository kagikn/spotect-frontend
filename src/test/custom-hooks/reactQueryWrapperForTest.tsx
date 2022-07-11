/* eslint-disable no-console */
import {ReactNode} from 'react';
import {QueryClient, QueryClientProvider, setLogger} from 'react-query';

setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {},
});

const QueryWrapperForTest = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({children}: {children: ReactNode}) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryWrapperForTest;
