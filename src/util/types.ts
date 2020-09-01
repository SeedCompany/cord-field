export type Nullable<T> = T | null | undefined;

export type ExtractStrict<T, U extends T> = T extends U ? T : never;
