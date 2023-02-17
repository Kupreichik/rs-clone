import { createSlice } from '@reduxjs/toolkit';

import { IPenData } from '../../components/index';
import { RootState } from '../store';

type InitialEditorState = {
  currentPenData: IPenData | null;
};

const initialState: InitialEditorState = {
  currentPenData: null,
};

const editor = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    updateEditorData(state, action) {
      state.currentPenData = action.payload.data;
    },
    clearEditorData(state) {
      state.currentPenData = null;
    },
  },
});

export const getCurrentPenData = (state: RootState) => state.editor.currentPenData;

export const { updateEditorData, clearEditorData } = editor.actions;

export const editorReducer = editor.reducer;
