import React from 'react';
import styled from 'styled-components';
import {css} from '@emotion/css';

const BarBackground = styled.div<{
  width?: string | number;
  height?: string | number;
  color?: string;
}>`
  width: ${(props) => props.width ?? '100%'};
  height: ${(props) => props.height ?? '20px'};
  background-color: ${(props) => props.color ?? 'transparent'};
`;

const BarFront = styled.div<{
  percentage: number;
  color: string;
}>`
  width: ${(props) => `${props.percentage}%`};
  height: 100%;
  background-color: ${(props) => `${props.color}`};
`;

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
