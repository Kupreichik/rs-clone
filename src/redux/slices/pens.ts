import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '../../axios';
import { IPenData } from '../../components/index';
import { RootState } from '../store';
import { updateEditorData } from './editor';

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

export const addPen = createAsyncThunk(
  'pens/addPen',
  async (params: Pick<IPenData, 'title' | 'html' | 'css' | 'js'>, { dispatch }) => {
    const { data } = await axios.post<IPenData>('/pens', params);

    dispatch(updateEditorData(data));

    return data;
  },
);

type TUpdateParams = {
  penId: string;
  params: { title: string; html: string; css: string; js: string };
};

export const updatePen = createAsyncThunk('pens/updatePen', async ({ penId, params }: TUpdateParams, { dispatch }) => {
  const { data } = await axios.put<IPenData>(`/pens/${penId}`, params);

  dispatch(updateEditorData(data));

  return data;
});

export const deletePen = createAsyncThunk('pens/deletePen', async (penId: string) => {
  const { data } = await axios.delete(`/pens/${penId}`);
  return { data, penId };
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
      })
      .addCase(addPen.fulfilled, (state, action) => {
        console.log('from addPen action', action);
        state.pens.push(action.payload);
      })
      .addCase(updatePen.fulfilled, (state, action) => {
        console.log('from update action', action);
        const penForUpdate = state.pens.find((pen) => pen._id === action.payload._id);
        if (penForUpdate) {
          penForUpdate.title = action.payload.title;
          penForUpdate.html = action.payload.html;
          penForUpdate.css = action.payload.css;
          penForUpdate.js = action.payload.js;
        }
      })
      .addCase(deletePen.fulfilled, (state, action) => {
        console.log('from delete action', action);
        state.pens = state.pens.filter((pen) => pen._id !== action.payload.penId);
      });
  },
});

export const getPens = (state: RootState) => state.pens.pens;
export const getPensStatus = (state: RootState) => state.pens.status;

export const pensReducer = pens.reducer;
