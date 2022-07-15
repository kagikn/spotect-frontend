import {useMemo} from 'react';
import {Virtuoso} from 'react-virtuoso';
import {useTranslation} from 'react-i18next';
import PageLoadingFailedView from '@/components/Layout/PageLoadingFailedView';
import {TrackObjectMinimum} from '@/types/spotifyDataTypes';
import SearchResultListItem from './SongSearchResultListItem';
import useSpotifySearchApi from '../hooks/useSpotifySearchApi';

const styleObj = {minHeight: '100vh'};

const trackObjectToSongSearchResultListItemContent2 = (
  index,
  item: TrackObjectMinimum
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

const NoResultItemView = (props: {query: string}) => {
  const {t} = useTranslation();

  const {query} = props;
  const truncatedQuery =
    query.length > 15 ? `${query.substring(0, 15)}...` : query;

  return (
    <div className="h-screen flex flex-col leading-6 justify-center items-center m-auto">
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

const EmptySearchQueryView = () => {
  const {t} = useTranslation();

  return (
    <div className="h-screen flex flex-col leading-6 justify-center items-center m-auto">
      <div className="text-center">
        <h1 className="font-bold text-xl my-4 tracking-[-0.04em]">
          {t('search.empty-search-input.big-message')}
        </h1>
        <p className="mb-10">{t('search.empty-search-input.small-message')}</p>
      </div>
    </div>
  );
};

const ListHeader = () => <div className="h-16" />;
const ListFooter = () => <div className="h-[4.375rem]" />;

const SongSearchResultList = (props: {query: string}) => {
  const {query} = props;
  const {data, error, fetchNextPage, isFetched, hasNextPage, refetch} =
    useSpotifySearchApi(query, 'track');

  const listData = useMemo(
    () => data?.pages.map((page) => page.items).flat() ?? [],
    [data]
  );

  if (query === '') {
    return <EmptySearchQueryView />;
  }

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
      overscan={200}
      itemContent={trackObjectToSongSearchResultListItemContent2}
      components={{Header: ListHeader, Footer: ListFooter}}
    />
  );
};

export default SongSearchResultList;
