import React, {useState, useEffect} from 'react';
import {useLocation, useMatch} from '@tanstack/react-location';
import {useTranslation} from 'react-i18next';
import {nanoid} from 'nanoid';
import {css} from '@emotion/css';
import {
  ArtistMinimumObject,
  SpotifyApiError,
  TrackObject,
} from '../../../DataTypes/spotifyDataTypes';
import Progress from './Progress';
import ColorQuantizer, {
  GeneratedSwatchType,
} from '../../../color_classes/ColorQuantizer';
import Color from '../../../color_classes/Color';
import SvgIcon from '../../SvgIcon/SvgIcon';
import PageNotFoundView from './PageNotFoundView';
import PageLoadingFailedView from './PageLoadingFailedView';
import useTrackApi from '../../../features/audio-features/hooks/useTrackApi';
import useAudioFeaturesApi from '../../../features/audio-features/hooks/useAudioFeaturesApi';

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

const concatArtistsName = (artists: ArtistMinimumObject[]) =>
  artists?.map((x) => x.name).join(', ') ?? '';

const ResultView = (
  audioFeatureItems: {
    value: number;
    color: string;
    backgroundColor: string;
    caption: string;
  }[],
  trackApiData: TrackObject,
  upperBackgroundColorStr: string,
  backButtonCallback: React.MouseEventHandler<HTMLButtonElement>
) => {
  const songName = trackApiData?.name ?? '';
  const trackImgUrl = trackApiData?.albumOfTrack.coverArt.sources[1].url;
  const artistNameConcatted = concatArtistsName(trackApiData?.artists);

  // eslint-disable-next-line react/destructuring-assignment
  const mappedAudioFeatureList = audioFeatureItems.map((item) => (
    <div className="py-2" key={nanoid()}>
      {item.caption ? (
        <p className="py-1">{`${item.caption}: ${item.value.toFixed(1)}`}</p>
      ) : null}
      <Progress
        value={item.value}
        height="20px"
        color={item.color}
        backgroundColor={item.backgroundColor}
        borderRadius="1.5rem"
      />
    </div>
  ));

  return (
    <>
      <div className="relative flex flex-col gap-y-2 p-4 pt-[4.5rem]">
        <div
          className={`block h-full w-full absolute top-0 left-0 z-[-1] ${css`
            background: linear-gradient(
              ${upperBackgroundColorStr} 0,
              transparent 100%
            );
          `}`}
        />
        <button
          type="button"
          className="w-8 h-8 inline-flex items-center justify-center cursor-pointer absolute rounded-full top-4 left-4 bg-gray-700"
          aria-hidden
          aria-label="戻る"
          onClick={backButtonCallback}>
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
        {artistNameConcatted ? (
          <p className="font-bold">{artistNameConcatted}</p>
        ) : (
          <div className="w-24 h-6 bg-clip-content rounded-xl bg-gray-700" />
        )}
      </div>
      <div className="bg-transparent p-4 mx-auto">
        <p className="font-bold text-lg">Mood</p>
        {mappedAudioFeatureList}
      </div>
    </>
  );
};

const AudioFeatureInfo = (): JSX.Element => {
  const mat = useMatch();
  const {t} = useTranslation();
  const location = useLocation();

  const {trackId} = mat.data;
  const audioFeatureQueryResult = useAudioFeaturesApi(trackId);
  const trackApiQueryResult = useTrackApi(trackId);

  const audioFeatureData = audioFeatureQueryResult.isFetched
    ? audioFeatureQueryResult.data
    : null;
  const barColor = 'var(--spotify-brand-color-bright)';
  const audioFeatureListItems = audioFeatureData
    ? [
        {
          value: audioFeatureData.acousticness * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.acousticness'),
        },
        {
          value: audioFeatureData.danceability * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.danceability'),
        },
        {
          value: audioFeatureData.energy * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.energy'),
        },
        {
          value: audioFeatureData.instrumentalness * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.instrumentalness'),
        },
        {
          value: audioFeatureData.liveness * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.liveness'),
        },
        {
          value: audioFeatureData.speechiness * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.speechiness'),
        },
        {
          value: audioFeatureData.valence * 100,
          color: barColor,
          backgroundColor: '#393939',
          caption: t('show-audio-features.valence'),
        },
      ]
    : [];

  const trackApiData = trackApiQueryResult.isFetched
    ? trackApiQueryResult.data
    : null;

  const featuredColorOfImage = useColor(
    trackApiData ? trackApiData.albumOfTrack.coverArt.sources[1].url : null,
    300
  )?.visRefSwatch;

  if (audioFeatureQueryResult.error) {
    const audioFeatureErrorInst = audioFeatureQueryResult.error;
    if (
      audioFeatureErrorInst instanceof SpotifyApiError &&
      audioFeatureErrorInst.httpStatusCode === 400
    ) {
      return <PageNotFoundView />;
    }

    const retryFetch = () => {
      audioFeatureQueryResult.refetch();
      trackApiQueryResult.refetch();
    };
    return <PageLoadingFailedView onRetryButtonClick={retryFetch} />;
  }
  if (trackApiQueryResult.error) {
    const audioFeatureErrorInst = trackApiQueryResult.error;
    if (
      audioFeatureErrorInst instanceof SpotifyApiError &&
      audioFeatureErrorInst.httpStatusCode === 400
    ) {
      return <PageNotFoundView />;
    }

    const retryFetch = () => {
      audioFeatureQueryResult.refetch();
      trackApiQueryResult.refetch();
    };
    return <PageLoadingFailedView onRetryButtonClick={retryFetch} />;
  }

  const rgbObj = featuredColorOfImage?.color;
  const rgbColStr = rgbObj?.toCSS() ?? 'transparent';

  const backButtonCallback = () => {
    location.history.back();
  };

  return ResultView(
    audioFeatureListItems,
    trackApiData,
    rgbColStr,
    backButtonCallback
  );
};

export default AudioFeatureInfo;
