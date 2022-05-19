import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import ColorQuantizer from '../../../color_classes/ColorQuantizer';
import Color from '../../../color_classes/Color';

const ContainerDiv = styled.div<{
  divColor?: string;
  contWidth?: string | number;
  contHeight?: string | number;
}>`
  text-align: center;
  margin: 0 auto;
  position: relative;
  width: 100%;
  background: ${(props) => (props.divColor ? props.divColor.toString() : '')};
  ${(props) =>
    props.contWidth ? `width: ${props.contWidth.toString()}` : 'width: 100%'};
  ${(props) =>
    props.contHeight ? `height: ${props.contHeight.toString()}` : ''};
`;

const ContainerDiv2 = styled.div<{
  contWidth?: string | number;
  contHeight?: string | number;
}>`
  text-align: center;
  margin: 0 auto;
  width: 100%;
  left: 0;
  position: absolute;
  top: 0;
  ${(props) =>
    props.contWidth ? `width: ${props.contWidth.toString()}` : 'width: 100%'};
  ${(props) =>
    props.contHeight ? `height: ${props.contHeight.toString()}` : ''};
`;

const GradDiv = styled.div`
  display: block;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%),
    url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=');
`;

function* Rgb32BitGenerator(t: ArrayBufferLike, pixelCountToPick: number) {
  const r = new Uint32Array(t);
  const e = Math.ceil(r.length / pixelCountToPick);
  for (let o = 0; o < r.length; o += e) yield r[o];
}

const CanvasTest = (): JSX.Element => {
  const [context, setContext] = useState<CanvasRenderingContext2D>(null);
  const [loaded, setLoaded] = useState(false);
  const [containerColor, setContainerColor] = useState<string>(null);
  const imgSize = 300; // max: 640

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasContext = canvas.getContext('2d');
    setContext(canvasContext);
  }, []);
  useEffect(() => {
    if (context !== null) {
      const imageURL =
        'https://i.scdn.co/image/ab67706c0000bebba7c9d45173cec7de53505632';

      const downloadedImg = new Image();
      downloadedImg.crossOrigin = 'Anonymous';
      downloadedImg.src = imageURL;
      downloadedImg.onload = () => {
        context.drawImage(downloadedImg, 0, 0, imgSize, imgSize);

        setLoaded(true);
      };
    }
  }, [context]);
  useEffect(() => {
    if (loaded) {
      const {buffer} = context.getImageData(0, 0, imgSize, imgSize).data;
      const colorQuant = ColorQuantizer.fromPixels(
        Rgb32BitGenerator(buffer, 22500),
        {
          maxColors: 16,
          filter: (color: Color) => {
            const {hsl} = color;

            const pcFlag = true;

            if (
              hsl.l <= 0.05 ||
              hsl.l >= 0.95 ||
              (pcFlag && hsl.h >= 10 && hsl.h <= 37 && hsl.s <= 0.82)
            ) {
              return false;
            }

            const {hsv} = color;
            return hsv.v > 0.2;
          },
        }
      );

      const res = ColorQuantizer.H(
        colorQuant.swatches,
        colorQuant.totalPixels,
        colorQuant.totalColors,
        colorQuant.totalSaturationFromHSV
      );
      setContainerColor(`${res.visRefSwatch.color.toCSS()}`);
    }
  }, [context, loaded]);

  return (
    <>
      <ContainerDiv
        id="container"
        divColor={containerColor}
        contHeight={`${imgSize}px`}>
        <GradDiv />
      </ContainerDiv>
      <ContainerDiv2 contHeight={`${imgSize}px`}>
        <canvas id="canvas" width={`${imgSize}px`} height={`${imgSize}px`} />
      </ContainerDiv2>
    </>
  );
};

export default CanvasTest;
