// "use client";

// import { Provider } from "react-redux";
// import { store } from "../redux/store";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../redux/slices/authSlice";
// import { getCookie } from "../lib/utils";

// // Define props interface
// interface ReduxProviderProps {
//   children: React.ReactNode;
// }

// export default function ReduxProvider({ children }: ReduxProviderProps) {
//   return (
//     <Provider store={store}>
//       <ReduxInitializer>{children}</ReduxInitializer>
//     </Provider>
//   );
// }

// // Define props for ReduxInitializer
// interface ReduxInitializerProps {
//   children: React.ReactNode;
// }

// function ReduxInitializer({ children }: ReduxInitializerProps) {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const token =
//         localStorage.getItem("token") || (await getCookie("authToken"));
//       if (token) {
//         // In a real app, fetch user data (id, email) from an API (e.g., /me endpoint)
//         // const response = await api.get<{
//         //   id: string;
//         //   email: string;
//         //   name?: string;
//         // }>("/me", {
//         //   headers: { Authorization: `Bearer ${token}` },
//         // });
//         // dispatch(
//         //   loginSuccess({
//         //     id: response.data.id,
//         //     email: response.data.email,
//         //     name: response.data.name,
//         //     token,
//         //   })
//         // );
//         dispatch(
//           loginSuccess({
//             id: "temp-id", // Replace with actual id from API or mocked data
//             email: "sarah@gmail.com", // Replace with actual email from API
//             name: "User", // Optional: fetch from API or use default
//             token,
//           })
//         );
//         console.log("Rehydrated state with token:", token);
//       }
//     };

//     initializeAuth();
//   }, [dispatch]);

//   return <>{children}</>;
// }


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
      dispatch(loginSuccess({ 
        user: { 
          email: "sarah@gmail.com",
          name: "Sarah" // Added default name to match your authSlice interface
        }, 
        token 
      }));
      console.log("Rehydrated state with token:", token);
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