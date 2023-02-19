import { createSlice } from '@reduxjs/toolkit';

import { IPenData } from '../../components/index';
import { RootState } from '../store';

type InitialEditorState = {
  currentPenData: IPenData | null;
  editorData: IPenData;
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

const initialState: InitialEditorState = {
  currentPenData: null,
  editorData: structuredClone(emptyPen),
};

const editor = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    updatePenData(state, action) {
      state.currentPenData = action.payload.data;
    },
    clearPenData(state) {
      state.currentPenData = null;
    },
    updateDatafromEditors(state, action) {
      if (state.editorData) {
        state.editorData.html = action.payload.html;
        state.editorData.css = action.payload.css;
        state.editorData.js = action.payload.js;
      }
    },
    updateEditorTitle(state, action) {
      if (state.editorData) {
        state.editorData.title = action.payload.title;
      }
    },
    updateEditorData(state, action) {
      state.editorData = action.payload;
    },
    clearEditorData(state) {
      state.editorData = structuredClone(emptyPen);
    },
  },
});

export const getCurrentPenData = (state: RootState) => state.editor.currentPenData;
export const getEditorData = (state: RootState) => state.editor.editorData;

export const {
  updatePenData,
  clearPenData,
  updateDatafromEditors,
  updateEditorTitle,
  updateEditorData,
  clearEditorData,
} = editor.actions;

export const editorReducer = editor.reducer;
