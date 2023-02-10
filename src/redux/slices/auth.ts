import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '../../axios';

type UserResponse = {
  name: string;
  username: string;
  email: string;
  avatar: string;
  token: string;
};

export type UserData = {
  identifier: string;
  password: string;
};

type InitialState = {
  data: UserResponse | null;
  status: 'loading' | 'loaded' | 'error';
};

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
  const { data } = await axios.post('/users/login', params);
  return data;
});

const initialState: InitialState = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuth.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
        console.log(action.payload, 'action.payload');
      })
      .addCase(fetchAuth.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      });
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
