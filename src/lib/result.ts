export type Failure<E = string> = {
  _tag: 'Failure';
  error: E;
};

export type Success<T = void> = {
  _tag: 'Success';
  data: T;
};

export type Result<T = void, E = string> = Failure<E> | Success<T>;

export function succeed<T = void>(data: T): Success<T> {
  return {
    _tag: 'Success',
    data: data,
  };
}

export function fail<E = string>(error: E): Failure<E> {
  return {
    _tag: 'Failure',
    error: error,
  };
}
