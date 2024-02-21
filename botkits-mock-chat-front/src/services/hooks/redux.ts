import { ThunkAction } from 'redux-thunk';
import { Action, ActionCreator, Dispatch } from 'redux';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';

export const useAppSelector: TypedUseSelectorHook<any> = selectorHook;

export type AppThunk<TReturn = void> = ActionCreator<
  ThunkAction<TReturn, Action, any, any>
>;

export const useAppDispatch = () => dispatchHook<Dispatch & AppThunk>();
