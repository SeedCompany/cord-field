export type Nullable<T> = T | null | undefined;
export type ExcludeImplementationFromUnion<T, P> = T extends P ? never : T;
