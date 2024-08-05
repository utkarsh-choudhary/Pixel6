import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ limit, skip }) => {
    const result = await axios('https://canopy-frontend-task.vercel.app/api/holdings');
    const groupedData = {};
    result.data.payload.forEach((row) => {
      if (!groupedData[row.asset_class]) {
        groupedData[row.asset_class] = [];
      }
      groupedData[row.asset_class].push(row);
    });
    return groupedData;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
    limit: 10,
    skip: 0,
    sortBy: 'id',
    filters: {
      gender: '',
      country: '',
    },
  },
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    incrementSkip: (state) => {
      state.skip += state.limit;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = [...state.users, ...action.payload];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSortBy, setFilter, incrementSkip } = userSlice.actions;

export default userSlice.reducer;
