export type Query<T extends Record<string, any>> = {
  [K in keyof T]?: T[K];
} & {
    [K in keyof T as `${string & K}_from`]?: T[K];
} & {
    [K in keyof T as `${string & K}_to`]?: T[K];
}

type Sort<T> =
  | keyof T
  | keyof { [K in keyof T as `${K}_asc`]: true }
  | keyof { [K in keyof T as `${K}_desc`]: true };

export interface Search<T> {
  query?: Query<T>;
  from?: number;
  size?: number;
  sort?: Sort<T>;
}
