import { configureStore } from '@reduxjs/toolkit';
import userReducer, { UserState } from './userSlice';

const loadState = (): UserState => {
  try {
    const serializedState = window.localStorage.getItem('loggedNoteappUser');
    if (serializedState === null) {
      return { user: null };
    }
    return { user: JSON.parse(serializedState) };
  } catch (err) {
    return { user: null };
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