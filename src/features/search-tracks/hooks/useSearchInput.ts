import {useState, useCallback} from 'react';

const useSearchInput = (
  initialValue?: string,
  onChangeAdditional?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onClearAdditional?: () => void
) => {
  const [value, setValue] = useState(initialValue ?? '');
  const [resettedOnLastValueChange, setResettedOnLastValueChange] =
    useState(false);

  return {
    value,
    resettedOnLastValueChange,
    onChange: useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setResettedOnLastValueChange(false);
        onChangeAdditional?.(e);
      },
      [onChangeAdditional]
    ),
    onClear: useCallback(() => {
      setValue('');
      setResettedOnLastValueChange(true);
      onClearAdditional?.();
    }, [onClearAdditional]),
  };
};

export default useSearchInput;
