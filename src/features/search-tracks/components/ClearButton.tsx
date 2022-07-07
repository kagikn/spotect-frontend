import {PropsWithChildren} from 'react';

type SearchIconOptions = {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  'aria-label'?: string;
  'data-testid'?: string;
};

const SearchIcon = (props: PropsWithChildren<SearchIconOptions>) => {
  const {
    className,
    onClick,
    'aria-label': ariaLabel,
    'data-testid': dataTestId,
    children,
  } = props;
  return (
    <button
      className={className}
      onClick={onClick}
      type="button"
      aria-hidden
      aria-label={ariaLabel}
      data-testid={dataTestId}>
      {children}
    </button>
  );
};

export default SearchIcon;
