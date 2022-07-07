import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {renderHook} from '@testing-library/react-hooks';
import fetch from 'isomorphic-unfetch';
import {test, expect, beforeAll, afterAll} from 'vitest';
import useSpotifySearchApi from '../../features/search-tracks/hooks/useSpotifySearchApi';
import {SearchDataResponse} from '../../types/spotifyDataTypes';
import {searchObj, searchObj2} from './searchResponseForTest';
import QueryWrapperForTest from './reactQueryWrapperForTest';

window.fetch = fetch;

const searchApiServer = setupServer(
  rest.get<Record<string, any>>(
    `${process.env.REACT_APP_API_BASE_URL}/v1/search`,
    (req, res, ctx) => {
      const query = req.url.searchParams.get('q');
      const bodyResponseWithNoItems = {
        items: [],
        pagingInfo: {nextOffset: null, limit: 20},
        totalCount: 0,
      };
      if (query !== 'Smells') {
        return res(ctx.status(200), ctx.json(bodyResponseWithNoItems));
      }

      const offsetString = req.url.searchParams.get('offset');
      const offsetNumber =
        offsetString != null ? parseInt(offsetString, 10) : 0;
      if (offsetNumber === 0) {
        return res(ctx.status(200), ctx.json(searchObj));
      }
      if (offsetNumber === 20) {
        return res(ctx.status(200), ctx.json(searchObj2));
      }
      return res(ctx.status(200), ctx.json(bodyResponseWithNoItems));
    }
  )
);

export {searchApiServer};

beforeAll(() => {
  searchApiServer.listen();
});
afterAll(() => {
  searchApiServer.close();
});

const selectSearchResponseItemToSmallerSubset = (res: SearchDataResponse) => {
  const itemsConved = res.items.map((item) => {
    const {albumOfTrack, artists, explicit, id, name} = item;
    const coverArtSources = albumOfTrack.coverArt.sources;

    return {
      albumOfTrackImageUrl64px: coverArtSources[2].url,
      albumOfTrackImageUrl300px: coverArtSources[1].url,
      artistNames: artists.map((arsistItem) => arsistItem.name),
      explicit,
      id,
      name,
    };
  });

  return {
    ...res,
    items: itemsConved,
  };
};

test('fetches the items from search api and converts the items in the expected 200 responses to smaller subsets', async () => {
  const {result, waitFor} = renderHook(
    () => useSpotifySearchApi('Smells', 'track'),
    {
      wrapper: QueryWrapperForTest(),
    }
  );

  await waitFor(() => result.current.isSuccess);

  await expect(result.current.data).toBeDefined();

  const dataPagesConverted = selectSearchResponseItemToSmallerSubset(searchObj);
  return expect(result.current.data!.pages[0]).toEqual(dataPagesConverted);
});

test('should fetch the next page if nextOffset in response is number and should not fetch the next page if nextOffset is null', async () => {
  const {result, waitFor} = renderHook(
    () => useSpotifySearchApi('Smells', 'track'),
    {
      wrapper: QueryWrapperForTest(),
    }
  );

  await waitFor(() => result.current.isSuccess);

  await expect(result.current.data).toBeDefined();

  const dataPagesConverted = selectSearchResponseItemToSmallerSubset(searchObj);
  await expect(result.current.data!.pages[0]).toEqual(dataPagesConverted);

  await expect(result.current.hasNextPage).toBe(true);
  await result.current.fetchNextPage();

  await expect(result.current.data!.pages).toEqual([
    selectSearchResponseItemToSmallerSubset(searchObj),
    selectSearchResponseItemToSmallerSubset(searchObj2),
  ]);

  await expect(result.current.hasNextPage).toBe(false);
  return expect(result.current.data!.pages[1].pagingInfo.nextOffset).toBe(null);
});
