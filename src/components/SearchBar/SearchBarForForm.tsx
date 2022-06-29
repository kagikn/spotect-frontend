import React, {FormEvent, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import CrossSvgIcon from '../SvgIcon/CrossSvgIcon';
import ClearButton from './ClearButton';
import SearchIcon from './SearchIcon';

const SearchBarForForm = (props: {
  value: string;
  onInputChange?: (text: React.ChangeEvent<HTMLInputElement>) => void;
  onInputClearButtonPressed?: () => void;
}): JSX.Element => {
  const {value, onInputChange, onInputClearButtonPressed} = props;

  const {t} = useTranslation();
  const inputAriaLabel = t('search.input-aria-label');
  const inputSearchPlaceholder = t('search.input-placeholder');
  const clearSearchFieldAriaLabel = t('search.clear-search-field-aria-label');

  const preventDefaultEventForForm = useCallback((e: FormEvent) => {
    e.preventDefault();
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      e.preventDefault();
      onInputChange?.(e);
    },
    [onInputChange]
  );
  const clearInput = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onInputClearButtonPressed?.();
      e.currentTarget.blur();
    },
    [onInputClearButtonPressed]
  );

  return (
    <div className="bg-[#242424] rounded-xl h-10 px-3 flex items-center justify-center grow">
      <SearchIcon
        stroke="#fff"
        width="24"
        height="24"
        additionalStrokeWidth="1%"
      />
      <form
        className="flex-grow"
        role="search"
        onSubmit={preventDefaultEventForForm}>
        <input
          className="text-white bg-transparent border-0 h-10 grow-1 shrink-0 basis-0 focus:outline-none w-full"
          defaultValue={value}
          onChange={handleInputChange}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label={inputAriaLabel}
          placeholder={inputSearchPlaceholder}
          data-testid="searchBarFormInput"
        />
      </form>
      {value !== '' ? (
        <ClearButton
          className="bg-transparent border-0 text-white p-0 cursor-pointer pointer-events-auto transition-[all_0.2s_ease_0s] focus:opacity-25 focus:outline-0 focus:transition-none"
          onClick={clearInput}
          aria-label={clearSearchFieldAriaLabel}
          data-testid="searchBarFormClearInput">
          <CrossSvgIcon
            stroke="#fff"
            width="24"
            height="24"
            fillOpacity={0.7}
            additionalStrokeWidth="1%"
          />
        </ClearButton>
      ) : null}
    </div>
  );
};

export default SearchBarForForm;
