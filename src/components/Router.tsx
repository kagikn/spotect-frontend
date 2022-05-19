import {Route, ReactLocation} from '@tanstack/react-location';
import React from 'react';

export const location = new ReactLocation();

export const routes: Route[] = [
  {
    path: '/',
    element: () => import('./views/home/Home').then((mod) => <mod.default />),
  },
  {
    path: '/search',
    children: [
      {
        path: ':query',
        element: () =>
          import('./views/home/SearchView').then((mod) => <mod.default />),
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
          import('./views/home/AudioFeatureInfo').then((mod) => (
            <mod.default />
          )),
        loader: async ({params: {trackId}}) => ({
          trackId,
        }),
      },
    ],
  },
];
