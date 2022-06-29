import {useQuery} from 'react-query';
import {
  SpotifyApiError,
  SpotifyApiErrorResponse,
  TrackObject,
} from '../../../DataTypes/spotifyDataTypes';

const useTrackApi = (trackId: string) =>
  useQuery<TrackObject, SpotifyApiErrorResponse>(
    ['spotify-tracks', trackId],
    async () => {
      const fetchedData = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/tracks/${trackId}`
      );

      const jsonData = await fetchedData.json();

      if (jsonData.error) {
        const jsonErrorData = jsonData.error as SpotifyApiErrorResponse;
        throw new SpotifyApiError(jsonErrorData.status, jsonErrorData.message);
      }

      return jsonData as TrackObject;
    }
  );

export default useTrackApi;
