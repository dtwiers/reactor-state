import { BehaviorSubject } from "rxjs";
import {
  ActionFunction,
  ActionObject,
  ReactorModule,
  ReactorModuleOptions,
  ReducerFunction,
} from "./types";

const createActionFunction =
  <T>(state$: BehaviorSubject<T>) =>
  <A extends unknown[]>(fn: ReducerFunction<T, A>): ActionFunction<A> =>
  (...params) =>
    fn(state$, ...params);

export const createModule = <T, A>(
  options: ReactorModuleOptions<T, A>
): ReactorModule<T, A> => {
  const state$ = new BehaviorSubject(options.initialState);
  const actionFunctionCreator = createActionFunction(state$);
  const actions: ActionObject<A> = Object.fromEntries(
    Object.keys(options.actions).map((key) => [
      key,
      actionFunctionCreator(options.actions[key as keyof A]),
    ])
  ) as any;
  return {
    getState: state$.getValue,
    actions,
  };
};
