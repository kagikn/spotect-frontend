import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from 'react-query';
import {useMatch, useNavigate} from '@tanstack/react-location';
import SongSearchResultList from '../../SearchResultList/SongSearchResultList';
import SearchBarForm from '../../SearchBar/SearchBarForForm';
import SvgIcon from '../../SvgIcon/SvgIcon';
import SearchResultListItem from '../../SearchResultList/SongSearchResultListItem';
import useAddPreconnectOnce from '../../useAddPreconnectOnce';
import SongSearchResultListDummyItem from '../../SearchResultList/SongSearchResultListDummyItem';
import useSearchInput from '../../SearchBar/useSearchInput';
import useDebounce from '../../SearchBar/useDebounce';

const SearchView = (): JSX.Element => {
  const {
    data: {query},
  } = useMatch();
  const navigate = useNavigate();

  const onChangeCallback = useCallback(
    (e) => {
      navigate({
        to: `/search/${encodeURIComponent(e.target.value.trimEnd())}`,
        replace: true,
      });
    },
    [navigate]
  );

  const {value, resettedOnLastValueChange, onChange, onClear} = useSearchInput(
    decodeURIComponent(query as string),
    onChangeCallback
  );

  const queryValue = value.trimEnd();

  const ListMemorized = <SongSearchResultList query={queryValue} />;

  // const SongSearchResultListMemorized = useMemo(() => , [value]);

  return (
    <>
      <div className="flex items-center justify-center min-w-0 h-16 bg-[#191919] py-0 px-3 sticky top-0 w-full z-[1]">
        <button
          type="button"
          className="w-8 h-8 bg-inherit border-inherit text-inherit cursor-pointer"
          aria-hidden
          aria-label="戻る">
          <SvgIcon width={22} height={22}>
            <path d="M15.957 2.793a1 1 0 010 1.414L8.164 12l7.793 7.793a1 1 0 11-1.414 1.414L5.336 12l9.207-9.207a1 1 0 011.414 0z" />
          </SvgIcon>
        </button>
        <SearchBarForm
          value={value}
          onInputChange={onChange}
          onInputClearButtonPressed={onClear}
        />
      </div>
      {ListMemorized}
    </>
  );
};

export default SearchView;
