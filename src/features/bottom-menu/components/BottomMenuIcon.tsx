import {memo} from 'react';
import {
  SvgIcon,
  svgPropParams,
  svgPropParamsNoChildren,
} from '@/components/Elements/SvgIcon/SvgIcon';

export type BottomMenuIconProps = {
  activeIcon: React.ReactElement<svgPropParams>;
  inactiveIcon: React.ReactElement<svgPropParams>;
  isActive: () => boolean;
};

export const BottomMenuIcon = (props: BottomMenuIconProps) => {
  const {isActive, activeIcon, inactiveIcon} = props;

  return isActive() ? activeIcon : inactiveIcon;
};
