export type Query<T> = {
  [K in keyof T]?: T[K] extends object ? Query<T[K]> : T[K];
} & {
  [K in keyof T as `${K}_from`]?: T[K] extends object ? never : T[K];
} & {
  [K in keyof T as `${K}_to`]?: T[K] extends object ? never : T[K];
};

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
