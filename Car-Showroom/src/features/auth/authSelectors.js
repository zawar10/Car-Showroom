export const selectAuthUser = (state) => state.auth?.user ?? null;
export const selectAuthToken = (state) => state.auth?.token ?? null;
export const selectAuthStatus = (state) => state.auth?.status ?? 'idle';
export const selectAuthError = (state) => state.auth?.error ?? null;
