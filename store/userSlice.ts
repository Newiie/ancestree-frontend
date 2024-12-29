import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  username: string | null | undefined;
  id: string | null | undefined;
  token: string | null | undefined;
  isCompleted: boolean;
}

const initialState: UserState = {
    username: null,
    id: null,
    token: null,
    isCompleted: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      console.log("USER ON SETUSER", action.payload);
      state.username = action.payload.username;
      state.id = action.payload.id;
      state.token = action.payload.token;
      state.isCompleted = action.payload.isCompleted || false;
    }
  },
});

export const selectToken = (state: { user: UserState }) => state.user.token;
export const selectId = (state: { user: UserState }) => state.user.id;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;