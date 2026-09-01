export const selectUsersList = (state) => state.usersList?.items ?? [];
export const selectUsersLoading = (state) => state.usersList?.loading ?? false;
export const selectUsersError = (state) => state.usersList?.error ?? null;
export const selectUsersSuccess = (state) => state.usersList?.success ?? false;
