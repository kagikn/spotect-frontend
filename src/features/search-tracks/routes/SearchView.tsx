import {useCallback, useEffect, useRef, useState} from 'react';
import {useMatch, useNavigate} from '@tanstack/react-location';
import {SvgIcon} from '@/components/Elements/SvgIcon';
import SongSearchResultList from '../components/SongSearchResultList';
import SearchBarForm from '../components/SearchBarForForm';
import useSearchInput from '../hooks/useSearchInput';
import useDebounce from '../hooks/useDebounce';

export const SearchView = (): JSX.Element => {
  const {
    data: {query},
  } = useMatch();
  const [inputtedSearchTerm, setInputtedSearchTerm] = useState<string>(
    decodeURIComponent(query)
  );
  const debouncedSearchTerm = useDebounce(inputtedSearchTerm, 400);
  const isFirstRender = useRef(true);

  const navigate = useNavigate();
  useEffect(() => {
    if (isFirstRender && isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const queryUri = encodeURIComponent(debouncedSearchTerm.trimEnd());
    const targetUrl = queryUri !== '' ? `/search/${queryUri}` : '/search';
    navigate({
      to: targetUrl,
      replace: true,
    });
  }, [navigate, debouncedSearchTerm]);

  const onChangeCallback = useCallback((e) => {
    setInputtedSearchTerm(e.target.value);
  }, []);
  const onClearCallback = useCallback(() => {
    setInputtedSearchTerm('');
    navigate({
      to: '/search',
      replace: true,
    });
  }, [navigate]);

  const queryValue = decodeURIComponent(
    debouncedSearchTerm as string
  ).trimEnd();

  const ListMemorized = <SongSearchResultList query={queryValue} />;

  return (
    <>
      <div className="flex items-center justify-center min-w-0 h-16 bg-black-0.85-opacity py-0 px-3 fixed top-0 w-full z-[1] backdrop-blur-md">
        <SearchBarForm
          value={inputtedSearchTerm}
          onInputChange={onChangeCallback}
          onInputClearButtonPressed={onClearCallback}
        />
      </div>
      {ListMemorized}
    </>
  );
};
