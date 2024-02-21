/* eslint-disable import/no-cycle */
import { combineReducers } from 'redux';
import { chatReducer } from './chat';

const appReducer = combineReducers({
  chat: chatReducer
});

const rootReducer = (
  state: any,
  action: any
) => {
  if (action.type === 'LOGOUT') {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
