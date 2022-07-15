import {ReactNode} from 'react';

type SvgDimensionType = {
  width?: number | string;
  height?: number | string;
  viewBox?: string;
};

type SvgStrokeType = {
  stroke?: string;
  additionalStrokeWidth?: string | number;
};

type SvgPropParamsNoChildren = {
  role?: string;
  fill?: string;
  fillOpacity?: string | number;
  className?: string;
} & SvgDimensionType &
  SvgStrokeType;

type SvgPropParams = {
  children: ReactNode;
} & SvgPropParamsNoChildren;

export const SvgIcon = (props: SvgPropParams): JSX.Element => {
  const {
    role,
    width,
    height,
    fill,
    fillOpacity,
    stroke,
    additionalStrokeWidth,
    viewBox,
    children,
    className,
  } = props;

  return (
    <svg
      className={className}
      role={role ?? 'img'}
      width={width}
      height={height}
      fill={fill ?? 'currentColor'}
      fillOpacity={fillOpacity ?? ''}
      stroke={stroke}
      strokeWidth={additionalStrokeWidth}
      viewBox={
        viewBox == null && width && height ? `0 0 ${width} ${height}` : viewBox
      }>
      {children}
    </svg>
  );
};

export {
  SvgPropParams as svgPropParams,
  SvgPropParamsNoChildren as svgPropParamsNoChildren,
};
