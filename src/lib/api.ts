// import axios, { AxiosRequestConfig,InternalAxiosRequestConfig, AxiosError } from "axios";
// import { v4 as uuidv4 } from "uuid";

// // ===== Types =====
// interface User {
//   id: string;
//   email: string;
//   password: string;
//   [key: string]: any;
// }

// interface LoginResponse {
//   token: string;
//   [key: string]: any;
// }

// interface RegisterResponse {
//   id: string;
//   token: string;
// }

// interface UserResponse {
//   id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   avatar: string;
//   role: string;
//   status: string;
//   created_at: string;
// }

// // ===== Axios Instance =====
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig<any>) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token");
//       if (token && config.headers) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ===== Helpers =====
// export const cleanUpExpiredUsers = (): User[] => {
//   const mockedUsers: User[] = JSON.parse(localStorage.getItem("mockedUsers") || "[]");
//   const now = new Date();
//   const expirationTime = 24 * 60 * 60 * 1000;

//   const validUsers = mockedUsers.filter((user) => {
//     const createdAt = new Date(user.createdAt);
//     return now.getTime() - createdAt.getTime() <= expirationTime;
//   });

//   localStorage.setItem("mockedUsers", JSON.stringify(validUsers));
//   return validUsers;
// };

// // ===== Auth =====
// export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
//   try {
//     const response = await api.post<LoginResponse>("/login", { email, password });
//     return response.data;
//   } catch (error: any) {
//     const isBrowser = typeof window !== "undefined";
//     const errDetails = error?.response?.data ?? error?.message ?? error;
//     isBrowser
//       ? console.log("🔐 Login error (client):", errDetails)
//       : console.log("🔐 Login error (server):", {
//           message: error?.message,
//           status: error?.response?.status,
//           stack: error?.stack,
//         });

//     const mockedUsers = cleanUpExpiredUsers();
//     const user = mockedUsers.find((u) => u.email === email && u.password === password);

//     if (user) {
//       return { token: `mock-token-${uuidv4()}` };
//     }

//     const errorMessage =
//       error?.response?.data?.error === "user not found"
//         ? "User not found. Please register first."
//         : error?.response?.data?.error || "Login failed. Please check your credentials.";

//     throw new Error(errorMessage);
//   }
// };

// export const registerUser = async (email: string, password: string): Promise<RegisterResponse> => {
//   try {
//     const response = await api.post<RegisterResponse>("/register", { email, password });
//     return response.data;
//   } catch (error: any) {
//     console.error("Registration error:", {
//       data: error.response?.data,
//       status: error.response?.status,
//       message: error.message,
//     });

//     const err = error.response?.data?.error;
//     if (err === "Note: Only defined users succeed registration") {
//       cleanUpExpiredUsers();
//       const newUser: User = {
//         id: Math.floor(Math.random() * 1000).toString(),
//         email,
//         password,
//       };
//       const mockedUsers: User[] = JSON.parse(localStorage.getItem("mockedUsers") || "[]");
//       mockedUsers.push(newUser);
//       localStorage.setItem("mockedUsers", JSON.stringify(mockedUsers));
//       return {
//         id: newUser.id,
//         token: `mock-token-${uuidv4()}`,
//       };
//     }

//     if (err === "Missing password") throw new Error("Password is required.");
//     if (err === "Missing email or username") throw new Error("Email is required.");
//     throw new Error(err || "Registration failed. Please try again.");
//   }
// };

// // ===== Users =====
// export const getUsers = async (): Promise<User[]> => {
//   try {
//     const page1 = await api.get<{ data: User[] }>("/users?page=1");
//     const page2 = await api.get<{ data: User[] }>("/users?page=2");
//     const reqresUsers = [...page1.data.data, ...page2.data.data];
//     const localUsers: User[] = JSON.parse(localStorage.getItem("localUsers") || "[]");
//     return [...localUsers, ...reqresUsers];
//   } catch (error: any) {
//     console.error("Get users error:", error.response?.data || error.message);
//     throw new Error("Failed to fetch users.");
//   }
// };

// export const getUserById = async (id: string): Promise<UserResponse> => {
//   try {
//     const localUsers: User[] = JSON.parse(localStorage.getItem("localUsers") || "[]");
//     const localUser = localUsers.find((user) => user.id === id);
//     if (localUser) {
//       return {
//         id: localUser.id,
//         first_name: localUser.first_name || "N/A",
//         last_name: localUser.last_name || "N/A",
//         email: localUser.email,
//         avatar: localUser.avatar || "N/A",
//         role: localUser.role || "General Back Office",
//         status: localUser.status || "Active",
//         created_at: localUser.createdAt || new Date().toISOString(),
//       };
//     }

//     const response = await api.get<{ data: any }>(`/users/${id}`);
//     const u = response.data.data;
//     return {
//       id: u.id.toString(),
//       first_name: u.first_name,
//       last_name: u.last_name,
//       email: u.email,
//       avatar: u.avatar,
//       role: u.role || "General Back Office",
//       status: u.status || "Active",
//       created_at: u.created_at || new Date().toISOString(),
//     };
//   } catch {
//     throw new Error("Failed to fetch user details.");
//   }
// };

// export const createUser = async (userData: Partial<User>): Promise<User> => {
//   try {
//     const response = await api.post<User>("/users", userData);
//     return response.data;
//   } catch {
//     throw new Error("Failed to create user.");
//   }
// };

// export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
//   try {
//     const response = await api.put<User>(`/users/${id}`, userData);

//     const localUsers: User[] = JSON.parse(localStorage.getItem("localUsers") || "[]");
//     const index = localUsers.findIndex((user) => user.id === id);
//     if (index !== -1) {
//       localUsers[index] = { ...localUsers[index], ...userData };
//       localStorage.setItem("localUsers", JSON.stringify(localUsers));
//     }

//     return response.data;
//   } catch (error: any) {
//     console.error("Update error:", error.response?.data || error.message);
//     throw new Error("Failed to update user.");
//   }
// };

// export const deleteUser = async (id: string): Promise<boolean> => {
//   try {
//     const response = await api.delete(`/users/${id}`);
//     const localUsers: User[] = JSON.parse(localStorage.getItem("localUsers") || "[]");
//     const updated = localUsers.filter((user) => user.id !== id);
//     localStorage.setItem("localUsers", JSON.stringify(updated));
//     return response.status === 204;
//   } catch (error: any) {
//     console.error("Delete error:", error.response?.data || error.message);
//     throw new Error("Failed to delete user.");
//   }
// };

// export default api;

import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const makeRequest = async <T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    throw error; 
  }
};

export default api;
