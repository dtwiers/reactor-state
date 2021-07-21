import type { BehaviorSubject } from "rxjs";

export type ReducerFunction<T, A extends unknown[]> = (
  state: BehaviorSubject<T>,
  ...params: A
) => void;

export type ReducerObject<T, A> = {
  [K in keyof A]: ReducerFunction<T, A[K] extends unknown[] ? A[K] : never>;
};

export type ActionFunction<A extends unknown[]> = (...params: A) => void;

export type ActionObject<A> = {
  [K in keyof A]: ActionFunction<A[K] extends unknown[] ? A[K] : never>;
};

export type ReactorModuleOptions<T, A> = {
  initialState: T;
  actions: ReducerObject<T, A>;
};

export type ReactorModule<T, A> = {
  getState: () => T;
  actions: ActionObject<A>;
};
