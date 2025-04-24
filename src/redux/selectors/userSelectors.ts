import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectUsersState = (state: RootState) => state.users;

export const selectUsers = createSelector(
  [selectUsersState],
  (usersState) => usersState.users
);

export const selectUsersLoading = createSelector(
  [selectUsersState],
  (usersState) => usersState.loading
);

export const selectUsersError = createSelector(
  [selectUsersState],
  (usersState) => usersState.error
);

export const selectTotalUsers = createSelector(
  [selectUsersState],
  (usersState) => usersState.totalUsers
);

export const selectTotalPages = createSelector(
  [selectUsersState],
  (usersState) => usersState.totalPages
);

export const selectLoggedInUser = createSelector(
  [selectUsersState],
  (usersState) => usersState.selectedUser
);
