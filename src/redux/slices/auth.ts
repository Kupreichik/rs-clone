import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '../../axios';
import { RootState } from '../store';

export type UserResponse = {
  name: string;
  username: string;
  email?: string;
  avatar?: string;
  token?: string;
};

export type UserData = {
  identifier: string;
  password: string;
};

export type InitialState = {
  data: UserResponse | null;
  status: 'loading' | 'loaded' | 'error';
};

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params: UserData) => {
  console.log(params, 'params');

  const { data } = await axios.post('/users/login', params);
  return data as UserResponse;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/users/me');
  return data as UserResponse;
});

export const fetchAuthLogout = createAsyncThunk('auth/fetchAuthLogout', async () => {
  const { data } = await axios.patch('/users/logout');
  return data as UserResponse;
});

export const fetchAuthRegister = createAsyncThunk('auth/fetchAuthRegister', async (params: UserResponse) => {
  const { data } = await axios.post('/users/register', params);
  return data as UserResponse;
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
      })
      .addCase(fetchAuth.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })
      .addCase(fetchAuthMe.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })
      .addCase(fetchAuthLogout.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchAuthLogout.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
      })
      .addCase(fetchAuthLogout.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })
      .addCase(fetchAuthRegister.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchAuthRegister.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
      })
      .addCase(fetchAuthRegister.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      });
  },
});

export const selectIsAuth = (state: RootState) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
