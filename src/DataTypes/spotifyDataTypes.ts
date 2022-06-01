export type ImageObject = {
  url: string;
  width?: number | undefined;
  height?: number | undefined;
};

export type AlbumOfTrackObject = {
  coverArt: {
    sources: ImageObject[];
  };
  id: string;
  name: string;
};

export type ArtistMinimumObject = {
  id: string;
  name: string;
};

export type TrackObject = {
  albumOfTrack: AlbumOfTrackObject;
  artists: ArtistMinimumObject[];
  duration: number;
  explicit: boolean;
  id: string;
  name: string;
  playable: boolean;
};

export type SearchDataResponse = {
  items: TrackObject[];
  pagingInfo: {
    nextOffset: number | null;
    limit: number;
  };
  totalCount: number;
};

export type SpotifyApiErrorResponse = {
  status: number;
  message: string;
};

export class SpotifyApiError extends Error {
  httpStatusCode: number;

  constructor(httpStatusCode: number, message: string) {
    super(message);
    this.httpStatusCode = httpStatusCode;
  }
}
