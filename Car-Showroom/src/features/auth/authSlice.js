import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/userApi';

const messageFor = (error, fallback) => error.response?.data?.message || error.message || fallback;

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(messageFor(error, 'Login failed'));
  }
});

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/users/register', payload);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(messageFor(error, 'Registration failed'));
  }
});

const initialState = {
  user: null,
  token: localStorage.getItem('autovista_token') || null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('autovista_token');
    },
    hydrateAuth: (state, action) => {
      state.user = action.payload?.user ?? null;
      state.token = action.payload?.token ?? null;
      if (action.payload?.token) {
        localStorage.setItem('autovista_token', action.payload.token);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (action.payload.token) localStorage.setItem('autovista_token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (action.payload.token) localStorage.setItem('autovista_token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logoutLocal, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
