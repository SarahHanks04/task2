"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useEffect, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

interface ReduxProviderProps {
  children: ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <ReduxInitializer>{children}</ReduxInitializer>
    </Provider>
  );
}

interface ReduxInitializerProps {
  children: ReactNode;
}

function ReduxInitializer({ children }: ReduxInitializerProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token") || getCookie("authToken");
    if (token) {
      dispatch(
        loginSuccess({
          user: {
            email: "",
            name: "User",
          },
          token,
        })
      );
    }
  }, [dispatch]);

  return children;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}
