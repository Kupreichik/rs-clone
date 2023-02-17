import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { authReducer } from './slices/auth';
import { editorReducer } from './slices/editor';
import { pensReducer } from './slices/pens';

const store = configureStore({
  reducer: {
    auth: authReducer,
    editor: editorReducer,
    pens: pensReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
