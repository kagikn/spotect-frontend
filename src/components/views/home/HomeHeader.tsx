import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import {CSSTransition} from 'react-transition-group';
import HomeTopNav from './HomeTopNav';

const BackdropDiv = styled.div<{
  animTime?: string | number;
}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(60, 60, 60, 0.3);
  z-index: 9999;
  transition-property: opacity;
  transition-timing-function: linear;
  transition-duration: ${(props) => props.animTime ?? 1000}ms;
  transition-delay: 0ms;
  opacity: 1;

  &.burger-menu-backdrop-enter {
    opacity: 0;
  }
  &.burger-menu-backdrop-enter-active {
    opacity: 1;
  }
  &.burger-menu-backdrop-exit {
    opacity: 1;
  }
  &.burger-menu-backdrop-exit-active {
    opacity: 0;
  }
`;

const BurgerMenuDiv = styled.div<{
  animTime?: string | number;
}>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(80%, 330px);
  background: var(--background-base);
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  z-index: 9999;
  transition-property: -webkit-transform, transform;
  transition-timing-function: ease;
  transition-duration: ${(props) => props.animTime ?? 1000}ms;
  transition-delay: 0ms;
  transform: translateX(0%);

  &.burger-menu-enter {
    transform: translateX(100%);
  }
  &.burger-menu-enter-active {
    transform: translateX(0%);
  }
  &.burger-menu-exit {
    transform: translateX(0%);
  }
  &.burger-menu-exit-active {
    transform: translateX(100%);
  }
`;

type backdropDivPropType = {
  onClick: () => void;
  animTimeMs: number;
};

const BackdropDivMemo = React.memo((props: backdropDivPropType) => (
  <BackdropDiv onClick={props.onClick} animTime={props.animTimeMs} />
));
BackdropDivMemo.displayName = 'BackdropDivMemo';

const CloseNavPannelButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  margin: -8px;
  padding: 8px;
  color: var(--pure-white);
  background-color: transparent;
  border: 0;
  line-height: 0;
  z-index: 10000;
  pointer-events: auto;
  cursor: pointer;
  appearance: none;
`;

const CloseNavPanelButtonSvg = React.memo(() => (
  <svg width="24" height="24" viewBox="0 0 12 12">
    <g fill="none" fillRule="evenodd" aria-hidden="true">
      <path d="M0 0h12v12H0" />
      <path
        fill="currentColor"
        d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"
      />
    </g>
  </svg>
));
CloseNavPanelButtonSvg.displayName = 'CloseNavPanelButtonSvg';

type BurgerMenuDivPropType = {
  animTimeMs: number;
  onClickCloseButton: () => void;
};

const BurgerMenuDivMemo = React.memo((props: BurgerMenuDivPropType) => (
  <BurgerMenuDiv animTime={props.animTimeMs}>
    <CloseNavPannelButton onClick={props.onClickCloseButton}>
      <CloseNavPanelButtonSvg />
    </CloseNavPannelButton>
  </BurgerMenuDiv>
));
BurgerMenuDivMemo.displayName = 'BurgerMenuDivMemo';

const HomeHeader = () => {
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const burgerMenuAnimTimeMs = 300;

  const handleClickBurgerMenu = useCallback(() => {
    setIsBurgerMenuOpen(true);
    setNoTransition(false);
  }, []);

  const handleClickBackdrop = useCallback(() => {
    setIsBurgerMenuOpen(false);
    setNoTransition(false);
  }, []);

  const handleClickCloseNavPannelButton = useCallback(() => {
    setIsBurgerMenuOpen(false);
    setNoTransition(false);
  }, []);

  const closeBurgerWhenWidthIsTooLong = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setNoTransition(true);
      setIsBurgerMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', closeBurgerWhenWidthIsTooLong);

    return () => {
      window.removeEventListener('resize', closeBurgerWhenWidthIsTooLong);
    };
  });

  return (
    <>
      <HomeTopNav onClick={handleClickBurgerMenu} />
      <CSSTransition
        in={isBurgerMenuOpen}
        timeout={noTransition ? 0 : 300}
        classNames="burger-menu-backdrop"
        mountOnEnter
        unmountOnExit>
        <BackdropDivMemo
          onClick={handleClickBackdrop}
          animTimeMs={burgerMenuAnimTimeMs}
        />
      </CSSTransition>
      <CSSTransition
        in={isBurgerMenuOpen}
        timeout={noTransition ? 0 : 300}
        classNames="burger-menu"
        mountOnEnter
        unmountOnExit>
        <BurgerMenuDivMemo
          onClickCloseButton={handleClickCloseNavPannelButton}
          animTimeMs={burgerMenuAnimTimeMs}
        />
      </CSSTransition>
    </>
  );
};

export default HomeHeader;
