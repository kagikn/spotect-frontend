import {useCallback, useEffect} from 'react';
import {useMatch, useNavigate} from '@tanstack/react-location';
import {SvgIcon} from '@/components/Elements/SvgIcon';
import SongSearchResultList from '../components/SongSearchResultList';
import SearchBarForm from '../components/SearchBarForForm';
import useSearchInput from '../hooks/useSearchInput';

export const SearchView = (): JSX.Element => {
  const {
    data: {query},
  } = useMatch();
  const navigate = useNavigate();

  const onChangeCallback = useCallback(
    (e) => {
      const queryUri = encodeURIComponent(e.target.value.trimEnd());
      const targetUrl = queryUri !== '' ? `/search/${queryUri}` : '/search';
      navigate({
        to: targetUrl,
        replace: true,
      });
    },
    [navigate]
  );
  const onClearCallback = useCallback(() => {
    navigate({
      to: '/search',
      replace: true,
    });
  }, [navigate]);

  const {value, resettedOnLastValueChange, onChange, onClear} = useSearchInput(
    decodeURIComponent(query as string),
    onChangeCallback,
    onClearCallback
  );

  const queryValue = value.trimEnd();

  const ListMemorized = <SongSearchResultList query={queryValue} />;

  return (
    <>
      <div className="flex items-center justify-center min-w-0 h-16 bg-black-0.85-opacity py-0 px-3 fixed top-0 w-full z-[1] backdrop-blur-md">
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
