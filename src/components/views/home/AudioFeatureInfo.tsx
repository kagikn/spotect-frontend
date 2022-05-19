import React, {useState, useEffect, FormEvent} from 'react';
import {useLocation, useMatch, useNavigate} from '@tanstack/react-location';
import {useTranslation} from 'react-i18next';
import {nanoid} from 'nanoid';
import {useQuery} from 'react-query';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {css} from '@emotion/css';
import styled from 'styled-components';
import {TrackObject} from '../../../spotifyDataTypes/spotifyDataTypes';
import Progress from './Progress';
import ColorQuantizer, {
  GeneratedSwatchType,
} from '../../../color_classes/ColorQuantizer';
import Color from '../../../color_classes/Color';
import SvgIcon from '../../SvgIcon/SvgIcon';

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

const useColor = (imgUrl: string, canvasSize: number) => {
  const [context, setContext] = useState<CanvasRenderingContext2D>(null);
  const [loaded, setLoaded] = useState(false);
  const [swatchColor, setSwatchColor] = useState<GeneratedSwatchType>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const canvasContext = canvas.getContext('2d');
    setContext(canvasContext);
    setLoaded(false);
  }, [canvasSize]);
  useEffect(() => {
    if (!loaded && context != null && imgUrl != null) {
      const imageURL = imgUrl;

      const downloadedImg = new Image();
      downloadedImg.crossOrigin = 'Anonymous';
      downloadedImg.src = imageURL;
      downloadedImg.onload = () => {
        context.drawImage(downloadedImg, 0, 0, canvasSize, canvasSize);

        setLoaded(true);
      };
    }
  }, [loaded, context, imgUrl, canvasSize]);
  useEffect(() => {
    if (loaded) {
      const {buffer} = context.getImageData(0, 0, canvasSize, canvasSize).data;
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
      setSwatchColor(res);
    }
  }, [canvasSize, context, loaded]);

  return swatchColor;
};

const AudioFeatureInfo = (): JSX.Element => {
  const [backgroundColCss, setBackgroundColCss] = useState<string>(null);
  const mat = useMatch();
  const {t} = useTranslation();
  const location = useLocation();

  const {trackId} = mat.data;

  const {data, error} = useQuery(['audio-features', trackId], async () => {
    const fetchedData = await fetch(
      `${import.meta.env.REACT_APP_API_BASE_URL}/v1/audio-features/${trackId}`
    );

    if (!fetchedData.ok) {
      throw Error();
    }

    const jsonData = await fetchedData.json();

    if (jsonData.error) {
      throw Error();
    }

    return (({
      acousticness,
      danceability,
      energy,
      instrumentalness,
      liveness,
      speechiness,
      valence,
    }) => ({
      acousticness,
      danceability,
      energy,
      instrumentalness,
      liveness,
      speechiness,
      valence,
    }))(jsonData);
  });

  const {data: getTrackData} = useQuery(
    ['spotify-tracks', trackId],
    async () => {
      const fetchedData = await fetch(
        `${import.meta.env.REACT_APP_API_BASE_URL}/v1/tracks/${trackId}`
      );

      if (!fetchedData.ok) {
        throw Error();
      }

      const jsonData = (await fetchedData.json()) as TrackObject;

      if (jsonData.error) {
        throw Error();
      }

      return jsonData;
    }
  );

  const musicMood = data as any;

  const barColor = 'var(--spotify-brand-color-bright)';

  const items = musicMood
    ? [
        {
          value: musicMood.acousticness * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.acousticness'),
        },
        {
          value: musicMood.danceability * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.danceability'),
        },
        {
          value: musicMood.energy * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.energy'),
        },
        {
          value: musicMood.instrumentalness * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.instrumentalness'),
        },
        {
          value: musicMood.liveness * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.liveness'),
        },
        {
          value: musicMood.speechiness * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.speechiness'),
        },
        {
          value: musicMood.valence * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.valence'),
        },
      ]
    : [];

  const songName = getTrackData?.name;
  const trackImgUrl = getTrackData?.albumOfTrack.coverArt.sources[1].url;
  const artistName = getTrackData?.artists.map((x) => x.name).join(', ');

  const aa = useColor(
    getTrackData?.albumOfTrack.coverArt.sources[1].url,
    300
  )?.visRefSwatch;

  if (error) return <div>Error Occured!</div>;
  if (!data) return null;

  const rgbaCol = aa?.color.rgb;
  const rgbColStr = rgbaCol
    ? `rgb(${rgbaCol.r}, ${rgbaCol.g}, ${rgbaCol.b})`
    : `transparent`;
  const rgbaColStr = rgbaCol
    ? `rgba(${rgbaCol.r}, ${rgbaCol.g}, ${rgbaCol.b}, 0.1)`
    : `transparent`;

  return (
    <>
      <div className="relative flex flex-col gap-y-2 p-4 pt-[4.5rem]">
        <div
          className={`block h-full w-full absolute top-0 left-0 z-[-1] ${css`
            background: linear-gradient(${rgbColStr} 0, transparent 100%);
          `}`}
        />
        <button
          type="button"
          className="w-8 h-8 inline-flex items-center justify-center cursor-pointer absolute rounded-full top-4 left-4 bg-gray-700"
          aria-hidden
          aria-label="戻る"
          onClick={() => {
            location.history.back();
          }}>
          <SvgIcon width={22} height={22} viewBox="0 0 24 24">
            <path d="M15.957 2.793a1 1 0 010 1.414L8.164 12l7.793 7.793a1 1 0 11-1.414 1.414L5.336 12l9.207-9.207a1 1 0 011.414 0z" />
          </SvgIcon>
        </button>
        <div className="w-[clamp(144px,40vw,288px)] h-[clamp(144px,40vw,288px)] self-center">
          <img
            src={trackImgUrl}
            className="bg-gray-700 m-auto w-full h-full"
            alt=""
          />
        </div>
        {songName ? (
          <h1 className="font-bold text-2xl">{songName}</h1>
        ) : (
          <div className="w-40 h-8 py-1 bg-clip-content rounded-2xl bg-gray-700" />
        )}
        {artistName ? (
          <p className="font-bold">{artistName}</p>
        ) : (
          <div className="w-24 h-6 bg-clip-content rounded-xl bg-gray-700" />
        )}
      </div>
      <div className="bg-transparent p-4 mx-auto">
        <p className="font-bold text-lg">Mood</p>
        {items.map((item) => (
          <div className="py-2" key={nanoid()}>
            {item.caption ? (
              <p className="py-1">{`${item.caption}: ${item.value.toFixed(
                1
              )}`}</p>
            ) : null}
            <Progress
              value={item.value}
              height="20px"
              color={item.color}
              backgroundColor={item.backgroundColor}
              borderRadius="1.5rem"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default AudioFeatureInfo;
