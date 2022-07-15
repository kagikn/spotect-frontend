import React from 'react';
import {useTranslation} from 'react-i18next';

const PageLoadingFailedView = (props: {
  onRetryButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const {t} = useTranslation();
  const {onRetryButtonClick: onClickProp} = props;

  return (
    <div className="flex flex-col leading-6 justify-center items-center h-screen m-auto">
      <div className="text-center">
        <h1 className="font-bold text-5xl my-4 tracking-[-0.04em]">
          {t('page-loading-failed-view.big-message')}
        </h1>
        <p className="mb-10">{t('page-loading-failed-view.small-message')}</p>
      </div>
      {onClickProp ? (
        <button
          type="button"
          className="bg-white text-black font-bold rounded-full px-8 pt-[11px] pb-[9px] no-underline"
          onClick={onClickProp}
          data-testid="pageLoadingFailedViewRetryButton">
          {t('page-loading-failed-view.reload-button')}
        </button>
      ) : null}
    </div>
  );
};

export default PageLoadingFailedView;
