import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
interface LoginSuccessPayload {
  user: {
    email: string;
    name: string;
  };
  token: string;
}

interface LogoutPayload {
  email?: string;
  reason?: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      state.user = {
        name: action.payload.user.name || "User",
        email: action.payload.user.email,
      };
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      document.cookie = `authToken=${action.payload.token}; path=/; max-age=3600`;
    },
    logout: (state, action: PayloadAction<LogoutPayload>) => {
      const { email } = action.payload;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      if (email) {
        localStorage.removeItem(`avatar-${email}`);
        localStorage.removeItem(`phone-${email}`);
      }
      document.cookie = "authToken=; path=/; max-age=0";
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
