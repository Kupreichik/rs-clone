import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '../../axios';
import { IPenData } from '../../components/index';
import { getPenData } from '../../utils/localstorage';
import { RootState } from '../store';

type InitialPensState = {
  pens: IPenData[];
  status: 'loading' | 'loaded' | 'error';
  currentPen: IPenData;
  searchQuery: string;
  likesUserPens: IPenData[];
};

type TUpdateParams = {
  penId: string;
  params: { title: string; html: string; css: string; js: string };
};

const { html, css, js } = getPenData();

const emptyPen = {
  _id: '',
  title: 'Untitled',
  html,
  css,
  js,
  likesCount: 0,
  viewsCount: 0,
  user: {
    name: '',
    username: '',
    avatar: '',
  },
};

const initialState: InitialPensState = {
  pens: [],
  currentPen: structuredClone(emptyPen),
  status: 'loading',
  searchQuery: '',
  likesUserPens: [],
};

export const fetchPens = createAsyncThunk('pens/fetchPens', async () => {
  const { data } = await axios.get<IPenData[]>('/pens');
  return data;
});

export const addPen = createAsyncThunk(
  'pens/addPen',
  async (params: Pick<IPenData, 'title' | 'html' | 'css' | 'js'>) => {
    const { data } = await axios.post<IPenData>('/pens', params);
    return data;
  },
);

export const updatePen = createAsyncThunk('pens/updatePen', async ({ penId, params }: TUpdateParams) => {
  const { data } = await axios.put<IPenData>(`/pens/${penId}`, params);

  return data;
});

export const deletePen = createAsyncThunk('pens/deletePen', async (penId: string) => {
  const { data } = await axios.delete(`/pens/${penId}`);
  return { data, penId };
});

export const fetchPen = createAsyncThunk('pens/fetchPen', async (idPen: string | undefined) => {
  const { data } = await axios.get(`/pens/one/${idPen}`);
  return data;
});

export const fetchLikesUserPens = createAsyncThunk('pens/fetchLikesUserPens', async () => {
  const { data } = await axios.get<IPenData[]>('/pens/loved');
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
      state.currentPen = structuredClone(emptyPen);
    },
    updateAllCurrentPenData(state, action) {
      state.currentPen = action.payload;
    },
    updatePenTitle(state, action) {
      state.currentPen.title = action.payload.title;
    },
    followSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearSearchQuery(state) {
      state.searchQuery = '';
    },
    clearLikesUserPens(state) {
      state.likesUserPens = [];
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
      })
      .addCase(fetchPens.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(addPen.fulfilled, (state, action) => {
        state.pens.push(action.payload);
        state.currentPen = action.payload;
      })
      .addCase(updatePen.fulfilled, (state, action) => {
        const penIndex = state.pens.findIndex((pen) => pen._id === action.payload._id);
        if (penIndex) {
          state.pens[penIndex] = { ...state.pens[penIndex], ...action.payload };
        }
      })
      .addCase(deletePen.fulfilled, (state, action) => {
        state.pens = state.pens.filter((pen) => pen._id !== action.payload.penId);
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
      })
      .addCase(fetchLikesUserPens.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLikesUserPens.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.likesUserPens = action.payload;
      })
      .addCase(fetchLikesUserPens.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export const getCurrentPen = (state: RootState) => state.pens.currentPen;
export const getPens = (state: RootState) => state.pens.pens;
export const getPensStatus = (state: RootState) => state.pens.status;

export const getPensQuery = (state: RootState) => state.pens.searchQuery;

export const getLikesUserPens = (state: RootState) => state.pens.likesUserPens;

export const {
  updateEditorHTML,
  updateEditorCSS,
  updateEditorJS,
  clearEditor,
  updateAllCurrentPenData,
  updatePenTitle,
  followSearchQuery,
  clearSearchQuery,
  clearLikesUserPens,
} = pens.actions;

export const pensReducer = pens.reducer;
