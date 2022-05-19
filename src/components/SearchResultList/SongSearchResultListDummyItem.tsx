import React from 'react';
import styled from 'styled-components';

const GradDiv = styled.div`
  display: grid;
  height: 72px;
  grid-template-columns: [img] 52px [first] 1fr;
  align-items: center;
  grid-gap: 14px;
  padding: 0 16px;

  &:active {
    opacity: 0.6;
  }
`;

const TextsDiv = styled.div`
  display: grid;
  align-items: center;
  column-gap: 8px;
  width: 100%;
  grid-template:
    'title'
    'subtitle' / auto 1fr;
`;

const SongNameSpan = styled.div`
  grid-area: title;
  height: 20px;
  width: 200px;
  padding: 3px 0;
  background-color: #282828;
  background-clip: content-box;
  border-radius: 8px;
`;

const ArtistNameSpan = styled.div`
  grid-area: subtitle;
  background-color: #282828;
  height: 14px;
  width: 120px;
  padding: 2px 0;
  background-clip: content-box;
  border-radius: 8px;
`;

const SongSearchResultListDummyItem = React.memo(() => (
  <div className="h-[4.5rem] grid grid-cols-[52px_1fr] px-4 py-2 items-center gap-3.5 text-inherit no-underline active:bg-black">
    <div className="bg-[#282828] w-[52px] h-[52px] " />
    <div className="grid grid-cols-[auto_1fr] gap-y-2 items-center">
      <div className="bg-[#282828] w-60 h-4 rounded-lg leading-6 truncate col-start-1 col-end-3" />
      <div className="bg-[#282828] w-32 h-3 rounded-lg leading-4 col-auto truncate" />
    </div>
  </div>
));

export default SongSearchResultListDummyItem;
