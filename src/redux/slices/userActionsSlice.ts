import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAction, User } from "../../types";

// Define state type
interface UserActionsState {
  actions: UserAction[];
}

// Define payload type for logUserAction
interface LogUserActionPayload {
  actionType: string;
  user: Pick<User, "id" | "first_name" | "last_name">;
  details?: Record<string, any>;
}

const initialState: UserActionsState = {
  actions: [],
};

const userActionsSlice = createSlice({
  name: "userActions",
  initialState,
  reducers: {
    logUserAction: (state, action: PayloadAction<LogUserActionPayload>) => {
      const newAction: UserAction = {
        id: Date.now(),
        actionType: action.payload.actionType,
        user: {
          id: action.payload.user.id,
          first_name: action.payload.user.first_name,
          last_name: action.payload.user.last_name,
        },
        timestamp: new Date().toISOString(),
        details: action.payload.details || {},
      };
      state.actions.unshift(newAction);
      state.actions = state.actions.slice(0, 5);
    },
    clearUserActions: (state) => {
      state.actions = [];
    },
  },
});

export const { logUserAction, clearUserActions } = userActionsSlice.actions;
export default userActionsSlice.reducer;
