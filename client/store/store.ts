import { configureStore } from '@reduxjs/toolkit';
import userReducer, { UserState } from './userSlice';

const loadState = (): UserState => {
  try {
    const serializedState = window.localStorage.getItem('AncestreeUser');
    if (serializedState === null) {
      return { username: null, id: null, token: null };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { username: null, id: null, token: null };
  }
};

const preloadedState = {
  user: loadState(),
};

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;