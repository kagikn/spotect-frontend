import React, {useEffect, useMemo, useRef} from 'react';
import {useQueryClient, useInfiniteQuery} from 'react-query';
import {Virtuoso} from 'react-virtuoso';
import {useTranslation} from 'react-i18next';
import addMemorizedPreconnectOnce from '../AddPreconnectOnce';
import SearchResultListItem from './SongSearchResultListItem';
import {SearchDataResponse} from '../../DataTypes/spotifyDataTypes';
import PageLoadingFailedView from '../views/home/PageLoadingFailedView';

const styleObj = {height: 'calc(100% - 60px)'};

type TrackObjectMinimumed = {
  albumOfTrackImageUrl64px: string;
  albumOfTrackImageUrl300px: string;
  artistNames: string[];
  explicit: boolean;
  id: string;
  name: string;
};

const trackObjectToSongSearchResultListItemContent2 = (
  index,
  item: TrackObjectMinimumed
) => {
  const {
    id,
    name: songName,
    artistNames,
    albumOfTrackImageUrl64px,
    albumOfTrackImageUrl300px,
  } = item;

  return (
    <SearchResultListItem
      img={albumOfTrackImageUrl64px}
      srcSet={`${albumOfTrackImageUrl64px} 1x, ${albumOfTrackImageUrl300px} 2x`}
      title={songName}
      subtitle={artistNames.join(', ')}
      key={`${index}spotect:track:${id}`}
      href={`/show-audio-features/${id}`}
      explicit={item.explicit}
    />
  );
};

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
      a('https://i.scdn.co');
      a(import.meta.env.REACT_APP_API_BASE_URL);
      const res = await fetch(
        `${
          import.meta.env.REACT_APP_API_BASE_URL
        }/v1/search?type=${type}&limit=50&q=${searchTerm}${
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
        'refetch',
      ],
      enabled: isSearchTermNonBlank,
    }
  );
};

const NoResultItemView = (props: {query: string}) => {
  const {t} = useTranslation();

  const {query} = props;
  const truncatedQuery =
    query.length > 15 ? `${query.substring(0, 15)}...` : query;

  return (
    <div className="flex flex-col leading-6 justify-center items-center h-full m-auto">
      <div className="text-center">
        <h1 className="font-bold text-xl my-4 tracking-[-0.04em]">
          {t('search.no-result-item-error.big-message', {
            query: truncatedQuery,
          })}
        </h1>
        <p className="mb-10">
          {t('search.no-result-item-error.small-message')}
        </p>
      </div>
    </div>
  );
};

const SongSearchResultList = (props: {query: string}) => {
  const {query} = props;
  const {data, error, fetchNextPage, isFetched, hasNextPage, refetch} =
    useSpotifySearchApi(query, 'track');

  const listData = useMemo(
    () => data?.pages.map((page) => page.items).flat() ?? [],
    [data]
  );

  if (error) {
    const onButtonClick = () => {
      if (hasNextPage) {
        fetchNextPage();
        return;
      }

      refetch();
    };
    return <PageLoadingFailedView onRetryButtonClick={onButtonClick} />;
  }

  if (!listData.length && isFetched) {
    return <NoResultItemView query={query} />;
  }

  return (
    <Virtuoso
      style={styleObj}
      endReached={fetchNextPage as (number) => void}
      data={listData ?? undefined}
      overscan={800}
      itemContent={trackObjectToSongSearchResultListItemContent2}
    />
  );
};

export default SongSearchResultList;
