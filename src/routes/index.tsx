import {Route, ReactLocation} from '@tanstack/react-location';
import {lazyImport} from '@/utils/lazyImport';

const {SearchView} = lazyImport(
  () => import('@/features/search-tracks'),
  'SearchView'
);

export const location = new ReactLocation();

export const routes: Route[] = [
  {
    path: '/search',
    children: [
      {
        path: '/',
        element: <SearchView />,
        loader: async ({params: {query}}) => ({
          query: '',
        }),
      },
      {
        path: ':query',
        element: <SearchView />,
        loader: async ({params: {query}}) => ({
          query,
        }),
      },
    ],
  },
  {
    path: 'show-audio-features',
    children: [
      {
        path: ':trackId',
        element: () =>
          import('../features/audio-features/routes/AudioFeatureInfo').then(
            (mod) => <mod.default />
          ),
        loader: async ({params: {trackId}}) => ({
          trackId,
        }),
      },
    ],
  },
];
