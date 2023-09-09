export type Query<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] | string;
} & {
    [K in keyof T as `${string & K}_from`]?: T[K] | string;
} & {
    [K in keyof T as `${string & K}_to`]?: T[K] | string;
}

type StringKeys<T> = Extract<keyof T, string>;

type Sort<T> =
    | StringKeys<T>
    | `${StringKeys<T>}_asc`
    | `${StringKeys<T>}_desc`;



export interface Search<T extends Record<string, any>> {
  query?: Partial<Query<T>>;
  from?: number;
  size?: number;
  sort?: Sort<T>;
  select?: keyof T & string []
}
