export type Result<T, E> =
  | {isOk: true; isErr: false; value: T}
  | {isOk: false; isErr: true; error: E};
