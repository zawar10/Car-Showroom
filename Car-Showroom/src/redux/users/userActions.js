import { createAsyncThunk } from '@reduxjs/toolkit'
import { createUserApi, deleteUserApi, getUsersApi, updateUserApi } from '../../services/userApi'

const messageFor = (error, fallback) => error.response?.data?.message || error.message || fallback

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
  try { return await getUsersApi() } catch (error) { return thunkAPI.rejectWithValue(messageFor(error, 'Failed to fetch users')) }
})
export const createUser = createAsyncThunk('users/createUser', async (payload, thunkAPI) => {
  try { return await createUserApi(payload) } catch (error) { return thunkAPI.rejectWithValue(messageFor(error, 'Failed to create user')) }
})
export const updateUser = createAsyncThunk('users/updateUser', async ({ id, payload }, thunkAPI) => {
  try { return await updateUserApi(id, payload) } catch (error) { return thunkAPI.rejectWithValue(messageFor(error, 'Failed to update user')) }
})
export const deleteUser = createAsyncThunk('users/deleteUser', async (id, thunkAPI) => {
  try { await deleteUserApi(id); return id } catch (error) { return thunkAPI.rejectWithValue(messageFor(error, 'Failed to delete user')) }
})
