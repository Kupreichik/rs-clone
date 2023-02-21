import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '../../axios';
import { IPenData } from '../../components';
import { RootState } from '../store';

export type RoomData = {
  roomId: string;
  username?: string;
  usersCount?: number;
};

type InitialRoomState = {
  data: RoomData | null;
  status: 'loading' | 'loaded' | 'error';
};

const initialState: InitialRoomState = {
  data: null,
  status: 'loading',
};

export const fetchEditingRoom = createAsyncThunk('editingRoom/fetchEditingRoom', async (currentPenData: IPenData) => {
  const { data } = await axios.post('/create-room', currentPenData);
  return data as RoomData;
});

const editingRoom = createSlice({
  name: 'editingRoom',
  initialState,
  reducers: {
    closeRoom(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEditingRoom.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchEditingRoom.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'loaded';
      })
      .addCase(fetchEditingRoom.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      });
  },
});

export const selectRoomId = (state: RootState) => state.editingRoom.data?.roomId;

export const editingRoomReducer = editingRoom.reducer;
