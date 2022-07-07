import React from 'react';
import {Link} from '@tanstack/react-location';

type SearchResultListItemProps = {
  img: string;
  srcSet: string;
  href: string;
  title: string;
  subtitle: string;
  explicit: boolean;
};

const SearchResultListItem = React.memo((props: SearchResultListItemProps) => (
  <Link
    className="h-[4.5rem] grid grid-cols-[52px_1fr] px-4 py-2 items-center gap-3.5 text-inherit no-underline active:bg-black"
    to={props.href}
    data-testid="searchResultListItem">
    <img
      className="bg-gray-800"
      src={props.img}
      width="52px"
      height="52px"
      srcSet={props.srcSet ?? ''}
      loading="eager"
      alt=""
    />
    <div className="grid grid-cols-[auto_1fr] gap-x-2 items-center">
      <span className="leading-6 truncate col-start-1 col-end-3">
        {props.title}
      </span>
      {props.explicit ? (
        <span className="inline-flex row-start-2 bg-white-0.6-opacity text-black font-bold col-span-1 truncate items-center justify-center text-[10px] h-[18px] w-[18px]">
          E
        </span>
      ) : null}
      <span className="text-sm leading-4 col-auto truncate text-subdued">
        {props.subtitle}
      </span>
    </div>
  </Link>
));

export default SearchResultListItem;
