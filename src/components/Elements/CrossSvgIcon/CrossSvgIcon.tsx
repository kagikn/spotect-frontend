import {memo} from 'react';
import {SvgIcon, svgPropParamsNoChildren} from '../SvgIcon/SvgIcon';

export const CrossSvgIcon = memo((props: svgPropParamsNoChildren) => {
  const {stroke, additionalStrokeWidth} = props;
  return (
    <SvgIcon
      {...props}
      stroke={stroke ?? 'currentColor'}
      additionalStrokeWidth={additionalStrokeWidth ?? 0}
      viewBox="0 0 1251 1251">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M625,0c-345.171,0 -624.996,279.829 -624.996,625c0,345.158 279.821,625.013 624.988,625.013c345.166,-0 625.016,-279.855 625.016,-625.013c0,-345.171 -279.846,-625 -625.008,-625Zm282.932,910.378c-24.954,24.933 -65.379,24.933 -90.312,-0l-189.383,-189.382l-189.407,189.407c-24.941,24.933 -65.37,24.933 -90.3,-0c-24.954,-24.963 -24.954,-65.379 0,-90.333l189.395,-189.395l-189.395,-189.386c-24.933,-24.963 -24.933,-65.379 0,-90.325c24.942,-24.942 65.38,-24.942 90.325,-0l189.387,189.386l189.378,-189.386c24.941,-24.934 65.391,-24.942 90.312,-0c24.954,24.962 24.954,65.404 0,90.325l-189.365,189.378l189.373,189.382c24.934,24.929 24.946,65.379 -0.008,90.329Z"
      />
    </SvgIcon>
  );
});
