import React from 'react';

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
