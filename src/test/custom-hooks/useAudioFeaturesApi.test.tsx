import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {renderHook} from '@testing-library/react-hooks';
import fetch from 'isomorphic-unfetch';
import {test, expect, beforeAll, afterAll} from 'vitest';
import useAudioFeaturesApi from '../../features/audio-features/hooks/useAudioFeaturesApi';
import QueryWrapperForTest from './reactQueryWrapperForTest';
import {
  AudioFeaturesCustom,
  AudioFeaturesCustomMinimum,
  SpotifyApiError,
} from '../../types/spotifyDataTypes';

window.fetch = fetch;

const audioFeatureResObj = {
  acousticness: 0.327,
  danceability: 0.591,
  duration_ms: 329413,
  energy: 0.804,
  instrumentalness: 5.98e-6,
  key: 0,
  liveness: 0.0818,
  loudness: -7.299,
  mode: 1,
  speechiness: 0.0454,
  tempo: 111.457,
  time_signature: 4,
  valence: 0.658,
};

const invalidRequestBody = {
  error: {
    status: 400,
    message: 'invalid request',
  },
};

const searchApiServer = setupServer(
  rest.get<Record<string, any>>(
    `${process.env.REACT_APP_API_BASE_URL}/v1/audio-features/*`,
    (req, res, ctx) => {
      const lastPathName = req.url.pathname.split('/').slice(-1)[0];
      if (lastPathName !== '7L3b6iaVhDVjfo52Hbvh9Z') {
        return res(ctx.status(400), ctx.json(invalidRequestBody));
      }

      return res(ctx.status(200), ctx.json(audioFeatureResObj));
    }
  )
);

beforeAll(() => {
  searchApiServer.listen();
});
afterAll(() => {
  searchApiServer.close();
});

const audioFeatureCustomToMinimum = (
  audioFeature: AudioFeaturesCustom
): AudioFeaturesCustomMinimum =>
  (({
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
  }))(audioFeature);

test('fetches the track info response with 200 status when the track ID is valid', async () => {
  const {result, waitFor} = renderHook(
    () => useAudioFeaturesApi('7L3b6iaVhDVjfo52Hbvh9Z'),
    {
      wrapper: QueryWrapperForTest(),
    }
  );

  await waitFor(() => result.current.isSuccess);
  return expect(result.current.data).toEqual(
    audioFeatureCustomToMinimum(audioFeatureResObj)
  );
});

test('should not fetch any track info response when the track ID is invalid', async () => {
  const {result, waitFor} = renderHook(() => useAudioFeaturesApi('GTAIV'), {
    wrapper: QueryWrapperForTest(),
  });

  await waitFor(() => !result.current.isFetching);
  return expect(result.current.error).toEqual(
    new SpotifyApiError(
      invalidRequestBody.error.status,
      invalidRequestBody.error.message
    )
  );
});
