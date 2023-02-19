import { createSlice } from '@reduxjs/toolkit';

import { IPenData } from '../../components/index';
import { RootState } from '../store';

type InitialEditorState = {
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
  editorData: structuredClone(emptyPen),
};

const editor = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    updateEditorTitle(state, action) {
      state.editorData.title = action.payload.title;
    },
    clearEditorData(state) {
      state.editorData = structuredClone(emptyPen);
    },
  },
});

export const getEditorData = (state: RootState) => state.editor.editorData;

export const { updateEditorTitle, clearEditorData } = editor.actions;

export const editorReducer = editor.reducer;
