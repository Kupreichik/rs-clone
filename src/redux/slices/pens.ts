import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '../../axios';
import { IPenData } from '../../components/PenItem/PenItem';

type InitialPensState = {
  pens: IPenData[];
  status: 'loading' | 'loaded' | 'error';
};

const initialState: InitialPensState = {
  pens: [],
  status: 'loading',
};

export const fetchPens = createAsyncThunk('pens/fetchPens', async () => {
  const { data } = await axios.get<IPenData[]>('/pens');
  return data;
});

const pens = createSlice({
  name: 'pens',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPens.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPens.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.pens = action.payload;
      })
      .addCase(fetchPens.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export const pensReducer = pens.reducer;