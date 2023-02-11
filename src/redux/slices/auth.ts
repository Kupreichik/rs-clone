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

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params: InitialState) => {
  const { data } = await axios.post('/users/login', params);
  return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/users/me');
  return data;
});

export const fetchAuthLogout = createAsyncThunk('auth/fetchAuthLogout', async () => {
  const { data } = await axios.patch('/users/logout');
  return data;
});

export const fetchAuthRegister = createAsyncThunk('auth/fetchAuthRegister', async (params) => {
  const { data } = await axios.post('/users/register', params);
  console.log(params);

  return data;
});

const initialState = {
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

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
