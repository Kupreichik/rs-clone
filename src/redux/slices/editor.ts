import { createSlice } from '@reduxjs/toolkit';

import { IPenData } from '../../components/PenItem/PenItem';

type InitialEditorState = {
  currentPenDta: IPenData | null;
};

const initialState: InitialEditorState = {
  currentPenDta: null,
};

const editor = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    updateData(state, action) {
      state.currentPenDta = action.payload.data;
    },
  },
});

export const { updateData } = editor.actions;

export const editorReducer = editor.reducer;
