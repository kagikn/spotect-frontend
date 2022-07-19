import {memo, ReactElement} from 'react';
import {useTranslation} from 'react-i18next';
import {
  SvgIcon,
  svgPropParams,
  svgPropParamsNoChildren,
} from '@/components/Elements/SvgIcon/SvgIcon';
import {Link} from '@tanstack/react-location';
import {BottomMenuIconProps} from './BottomMenuIcon';

export const BottomMenuButton = (props: {
  href: string;
  text: string;
  children: ReactElement<BottomMenuIconProps>;
}) => {
  const {href, text, children} = props;

  return (
    <Link to={href} className="flex flex-1 flex-col items-center">
      {children}
      <span className="text-xs leading-4 transform-none">{text}</span>
    </Link>
  );
};
