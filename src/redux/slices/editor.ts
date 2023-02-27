import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';

export type ViewMode = 'horizontal' | 'vertical';

type InitialEditorState = {
  viewMode: ViewMode;
};

const initialState: InitialEditorState = {
  viewMode: 'vertical',
};

const editor = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    updateViewMode(state, action) {
      state.viewMode = action.payload;
    },
  },
});

export const getEditorData = (state: RootState) => state.editor;

export const { updateViewMode } = editor.actions;

export const editorReducer = editor.reducer;
