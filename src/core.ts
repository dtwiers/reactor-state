import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";
import {
  ActionFunction,
  ActionObject,
  ReactorModule,
  ReactorModuleOptions,
  ReducerFunction,
} from "./types";

const createActionFunction =
  <T>(state$: BehaviorSubject<T>, action$: ReplaySubject<unknown>) =>
  <A extends unknown[]>(key: string, fn: ReducerFunction<T, A>): ActionFunction<A> =>
  (...params) => {
    action$.next({category: "before", type: key, params: params})
    fn(state$, ...params);
    action$.next({category: "after", type: key, params: params});
  }


export const createModule = <T, A>(
  options: ReactorModuleOptions<T, A>
): ReactorModule<T, A> => {
  const state$ = new BehaviorSubject(options.initialState);
  const action$ = new ReplaySubject();
  const actionFunctionCreator = createActionFunction(state$, action$);
  const actions: ActionObject<A> = Object.fromEntries(
    Object.keys(options.actions).map((key) => [
      key,
      actionFunctionCreator(key, options.actions[key as keyof A]),
    ])
  ) as any;
  return {
    getState: state$.getValue,
    actions,
  };
};