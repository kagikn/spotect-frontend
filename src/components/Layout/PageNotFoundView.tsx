import React from 'react';
import {useTranslation} from 'react-i18next';

const PageNotFoundView = () => {
  const {t} = useTranslation();

  return (
    <div className="flex flex-col leading-6 justify-center items-center h-screen m-auto">
      <div className="text-center">
        <h1 className="font-bold text-5xl my-4 tracking-[-0.04em]">
          {t('not-found-view.big-message')}
        </h1>
        <p className="mb-10">{t('not-found-view.small-message')}</p>
      </div>
    </div>
  );
};

export default PageNotFoundView;
