import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '../../axios';

type userData = {
  identifier: string;
  password: string;
};

// type InitialState = {
//   data: userData[] | null;
//   status: string;
// };

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
  const { data } = await axios.post('/users/login', params);
  return data as userData;
});

const initialState = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
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
      });

    // {
    //   [(fetchAuth as any).pending]: (state) => {
    //     state.status = 'loading';
    //     state.data = null;
    //   },
    //   [(fetchAuth as any).fulfilled]: (state, action) => {
    //     state.status = 'loaded';
    //     state.data = action.payload;
    //   },
    //   [(fetchAuth as any).rejected]: (state) => {
    //     state.status = 'error';
    //     state.data = null;
    //   },
  },
});

export const authReducer = authSlice.reducer;
