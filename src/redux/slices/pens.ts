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

type TUpdateParams = {
  penId: string;
  params: { title: string; html: string; css: string; js: string };
};

const emptyPen = {
  _id: '',
  title: 'Untitled',
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
};

const initialState: InitialPensState = {
  pens: [],
  currentPen: structuredClone(emptyPen),
  status: 'loading',
  searchQuery: '',
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
      .addCase(addPen.fulfilled, (state, action) => {
        state.pens.push(action.payload);
        state.currentPen = action.payload;
      })
      .addCase(updatePen.fulfilled, (state, action) => {
        const penIindex = state.pens.findIndex((pen) => pen._id === action.payload._id);
        if (penIindex) {
          state.pens[penIindex] = { ...state.pens[penIindex], ...action.payload };
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
      });
  },
});

export const getCurrentPen = (state: RootState) => state.pens.currentPen;
export const getPens = (state: RootState) => state.pens.pens;
export const getPensStatus = (state: RootState) => state.pens.status;

export const getPensQuery = (state: RootState) => state.pens.searchQuery;

export const {
  updateEditorHTML,
  updateEditorCSS,
  updateEditorJS,
  clearEditor,
  updateAllCurrentPenData,
  updatePenTitle,
  followSearchQuery,
} = pens.actions;

export const pensReducer = pens.reducer;
