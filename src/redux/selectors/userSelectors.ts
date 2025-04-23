import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
// import { UserState, AuthState } from "@/types/dashboard";

const selectUserState = (state: RootState) => state.users;
const selectAuthState = (state: RootState) => state.auth;

export const selectUsers = createSelector(
  [selectUserState],
  (userState) => userState.users
);

export const selectUsersLoading = createSelector(
  [selectUserState],
  (userState) => userState.loading
);

export const selectUsersError = createSelector(
  [selectUserState],
  (userState) => userState.error
);

export const selectSelectedUser = createSelector(
  [selectUserState],
  (userState) => userState.selectedUser
);

export const selectLoggedInUser = createSelector(
  [selectAuthState],
  (authState) => authState.user
);
