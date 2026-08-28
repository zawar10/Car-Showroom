import { createSlice } from '@reduxjs/toolkit'
import { createUser, deleteUser, fetchUsers, updateUser } from './userActions'

const initialState = { users: [], selectedUser: null, loading: false, error: null, success: false }
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: state => { state.error = null },
    clearUserSuccess: state => { state.success = false },
    setSelectedUser: (state, action) => { state.selectedUser = action.payload },
    clearSelectedUser: state => { state.selectedUser = null },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => { state.loading = true; state.error = null })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = Array.isArray(action.payload) ? action.payload : [] })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createUser.pending, state => { state.loading = true; state.error = null; state.success = false })
      .addCase(createUser.fulfilled, (state, action) => { state.loading = false; state.users.unshift(action.payload); state.success = true })
      .addCase(createUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(updateUser.pending, state => { state.loading = true; state.error = null; state.success = false })
      .addCase(updateUser.fulfilled, (state, action) => { state.loading = false; const index = state.users.findIndex(user => user.id === action.payload.id); if (index !== -1) state.users[index] = action.payload; state.success = true })
      .addCase(updateUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(deleteUser.pending, state => { state.loading = true; state.error = null; state.success = false })
      .addCase(deleteUser.fulfilled, (state, action) => { state.loading = false; state.users = state.users.filter(user => user.id !== action.payload); state.success = true })
      .addCase(deleteUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { clearUserError, clearUserSuccess, setSelectedUser, clearSelectedUser } = userSlice.actions
export default userSlice.reducer
