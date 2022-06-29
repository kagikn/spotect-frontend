import React, {useMemo} from 'react';
import {Virtuoso} from 'react-virtuoso';
import {useTranslation} from 'react-i18next';
import SearchResultListItem from './SongSearchResultListItem';
import {TrackObjectMinimum} from '../../DataTypes/spotifyDataTypes';
import PageLoadingFailedView from '../views/home/PageLoadingFailedView';
import useSpotifySearchApi from '../../features/search-tracks/hooks/useSpotifySearchApi';

const styleObj = {height: 'calc(100% - 60px)'};

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
      overscan={200}
      itemContent={trackObjectToSongSearchResultListItemContent2}
    />
  );
};

export default SongSearchResultList;
