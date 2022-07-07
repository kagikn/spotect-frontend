import {useQuery} from 'react-query';
import {
  SpotifyApiErrorResponse,
  AudioFeaturesCustom,
  AudioFeaturesCustomMinimum,
  SpotifyApiError,
} from '@/types/spotifyDataTypes';

const audioFeatureCustomToMinimum = (audioFeature: AudioFeaturesCustom) =>
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

const useAudioFeatureApi = (trackId: string) =>
  useQuery<AudioFeaturesCustomMinimum, SpotifyApiError | TypeError>(
    ['audio-features', trackId],
    async () => {
      const fetchedData = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/audio-features/${trackId}`
      );

      const jsonData = await fetchedData.json();

      if (jsonData.error) {
        const jsonErrorData = jsonData.error as SpotifyApiErrorResponse;
        throw new SpotifyApiError(jsonErrorData.status, jsonErrorData.message);
      }

      return audioFeatureCustomToMinimum(jsonData);
    }
  );

export default useAudioFeatureApi;
