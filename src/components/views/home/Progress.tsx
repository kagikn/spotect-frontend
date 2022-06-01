import React from 'react';
import {css} from '@emotion/css';

type ProgressPropType = {
  value: number;
  height: string | number;
  color: string;
  backgroundColor?: string;
  borderRadius?: string | number;
  className?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Progress = (props: ProgressPropType): JSX.Element => {
  const {
    value,
    height,
    color,
    backgroundColor,
    borderRadius: propBorderRadius,
  } = props;
  return (
    <div
      className={css`
        height: ${height};
        background-color: ${backgroundColor ?? 'transparent'};
        ${propBorderRadius ? `border-radius: ${propBorderRadius};` : ''}
        overflow-x: auto;
      `}>
      <div
        style={{width: `${value}%`}}
        className={css`
          height: 100%;
          background-color: ${color};
        `}
      />
    </div>
  );
};

export default Progress;
export {ProgressPropType};
