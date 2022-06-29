import React, {useEffect, useRef} from 'react';
import {useQueryClient, useInfiniteQuery} from 'react-query';
import addMemorizedPreconnectOnce from '../../../components/AddPreconnectOnce';
import {SearchDataResponse} from '../../../DataTypes/spotifyDataTypes';

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

function usePrevious(value, initial) {
  const ref = useRef({target: value, previous: initial});
  if (ref.current.target !== value) {
    ref.current.previous = ref.current.target;
    ref.current.target = value;
  }
  return ref.current.previous;
}

const useSpotifySearchApi = (searchTerm: string, type: 'track') => {
  const [a] = React.useState(() => addMemorizedPreconnectOnce());

  const prevQueryTerm = usePrevious(searchTerm, searchTerm);

  const queryClient = useQueryClient();
  useEffect(() => {
    if (searchTerm !== prevQueryTerm) {
      queryClient.cancelQueries(`searchForTracks:${prevQueryTerm}`);
    }
  });

  const isSearchTermNonBlank = searchTerm !== '';

  return useInfiniteQuery(
    `searchForTracks:${searchTerm}`,
    async ({pageParam = 0, signal}) => {
      const res = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/v1/search?type=${type}&limit=20&q=${searchTerm}${
          pageParam !== 0 ? `&offset=${pageParam}` : ''
        }`,
        {signal}
      );
      return res.json();
    },
    {
      select: (dataToSelect) => {
        const {pages: dataPages, pageParams: dataPageParams} = dataToSelect;
        const dataPagesConverted = dataPages.map(
          selectSearchResponseItemToSmallerSubset
        );

        return {
          pages: dataPagesConverted,
          pageParams: dataPageParams,
        };
      },
      getNextPageParam: (lastPage: SearchDataResponse) =>
        lastPage.pagingInfo?.nextOffset ?? undefined,
      notifyOnChangeProps: [
        'data',
        'error',
        'fetchNextPage',
        'hasNextPage',
        'isFetched',
        'isSuccess',
        'refetch',
      ],
      enabled: isSearchTermNonBlank,
    }
  );
};

export default useSpotifySearchApi;
