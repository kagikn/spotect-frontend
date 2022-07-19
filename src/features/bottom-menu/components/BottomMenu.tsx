import {SvgIcon} from '@/components/Elements/SvgIcon';
import {useMatchRoute} from '@tanstack/react-location';
import {useTranslation} from 'react-i18next';
import {BottomMenuIcon} from './BottomMenuIcon';
import {BottomMenuButton} from './BottomMenuButton';

const HomeIconInacvive = (
  <SvgIcon width={24} height={24} viewBox="0 0 24 24">
    <path d="M12.5 3.247a1 1 0 00-1 0L4 7.577V20h4.5v-6a1 1 0 011-1h5a1 1 0 011 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 013 0l7.5 4.33a2 2 0 011 1.732V21a1 1 0 01-1 1h-6.5a1 1 0 01-1-1v-6h-3v6a1 1 0 01-1 1H3a1 1 0 01-1-1V7.577a2 2 0 011-1.732l7.5-4.33z" />
  </SvgIcon>
);

const HomeIconAcvive = (
  <SvgIcon width={24} height={24} viewBox="0 0 24 24">
    <path d="M13.5 1.515a3 3 0 00-3 0L3 5.845a2 2 0 00-1 1.732V21a1 1 0 001 1h6a1 1 0 001-1v-6h4v6a1 1 0 001 1h6a1 1 0 001-1V7.577a2 2 0 00-1-1.732l-7.5-4.33z" />
  </SvgIcon>
);

const SearchIconInacvive = (
  <SvgIcon width={24} height={24} viewBox="0 0 24 24">
    <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 101.414-1.414l-4.344-4.344a9.157 9.157 0 002.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
  </SvgIcon>
);

const SearchIconAcvive = (
  <SvgIcon width={24} height={24} viewBox="0 0 24 24">
    <path d="M15.356 10.558c0 2.623-2.16 4.75-4.823 4.75-2.664 0-4.824-2.127-4.824-4.75s2.16-4.75 4.824-4.75c2.664 0 4.823 2.127 4.823 4.75z" />
    <path d="M1.126 10.558c0-5.14 4.226-9.28 9.407-9.28 5.18 0 9.407 4.14 9.407 9.28a9.157 9.157 0 01-2.077 5.816l4.344 4.344a1 1 0 01-1.414 1.414l-4.353-4.353a9.454 9.454 0 01-5.907 2.058c-5.18 0-9.407-4.14-9.407-9.28zm9.407-7.28c-4.105 0-7.407 3.274-7.407 7.28s3.302 7.279 7.407 7.279 7.407-3.273 7.407-7.28c0-4.005-3.302-7.278-7.407-7.278z" />
  </SvgIcon>
);

export const BottomMenu = () => {
  const {t} = useTranslation();
  const matchRoute = useMatchRoute();

  const isHomeActive = () => !!matchRoute({to: '/home'});
  const isSearchActive = () =>
    !!matchRoute({to: '/search'}) || !!matchRoute({to: '/search/*'});
  const homeButtonText = t('bottom-menu.home');
  const searchButtonText = t('bottom-menu.search');

  return (
    <div className="w-full flex items-center bottom-0 z-10 h-[4.375rem] bg-gradient-to-t from-black-bg-base to-black-bg-base-0.8-opacity fixed">
      <BottomMenuButton href="/home" text={homeButtonText}>
        <BottomMenuIcon
          activeIcon={HomeIconAcvive}
          inactiveIcon={HomeIconInacvive}
          isActive={isHomeActive}
        />
      </BottomMenuButton>
      <BottomMenuButton href="/search" text={searchButtonText}>
        <BottomMenuIcon
          activeIcon={SearchIconAcvive}
          inactiveIcon={SearchIconInacvive}
          isActive={isSearchActive}
        />
      </BottomMenuButton>
    </div>
  );
};
