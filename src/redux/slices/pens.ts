import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '../../axios';
import { IPenData } from '../../components/index';
import { RootState } from '../store';

type InitialPensState = {
  pens: IPenData[];
  status: 'loading' | 'loaded' | 'error';
  currentPen: IPenData;
  searchQuery: string;
};

const initialState: InitialPensState = {
  pens: [],
  status: 'loading',
  currentPen: {
    _id: '',
    title: '',
    html: '',
    css: '',
    js: '',
    likesCount: 0,
    viewsCount: 0,
    user: {
      name: '',
      username: '',
      avatar: '',
    },
  },
  searchQuery: '',
};

export const fetchPens = createAsyncThunk('pens/fetchPens', async () => {
  const { data } = await axios.get<IPenData[]>('/pens');
  return data;
});

export const fetchPen = createAsyncThunk('pens/fetchPen', async (idPen: string | undefined) => {
  const { data } = await axios.get(`/pens/one/${idPen}`);
  return data;
});

const pens = createSlice({
  name: 'pens',
  initialState,
  reducers: {
    updateEditorHTML(state, action) {
      if (state.currentPen) {
        state.currentPen.html = action.payload;
      }
    },
    updateEditorCSS(state, action) {
      if (state.currentPen) {
        state.currentPen.css = action.payload;
      }
    },
    updateEditorJS(state, action) {
      if (state.currentPen) {
        state.currentPen.js = action.payload;
      }
    },
    clearEditor(state) {
      state.currentPen.html = '';
      state.currentPen.css = '';
      state.currentPen.js = '';
    },
    followSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPens.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPens.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.pens = action.payload;
        console.log(state.pens);
      })
      .addCase(fetchPens.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(fetchPen.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPen.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.currentPen = action.payload;
      })
      .addCase(fetchPen.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export const getCurrentPen = (state: RootState) => state.pens.currentPen;
export const getPens = (state: RootState) => state.pens.pens;
export const getPensStatus = (state: RootState) => state.pens.status;

export const getPensQuery = (state: RootState) => state.pens.searchQuery;

export const { updateEditorHTML, updateEditorCSS, updateEditorJS, clearEditor, followSearchQuery } = pens.actions;

export const pensReducer = pens.reducer;
