// import { storage } from "../utils/storage";
// import { handleApiError } from "../utils/errorHandler";
// import { makeRequest } from "@/lib/api";

// // Types
// interface User {
//   id: string;
//   email: string;
//   password: string;
//   first_name?: string;
//   last_name?: string;
//   avatar?: string;
//   role?: string;
//   status?: string;
//   createdAt?: string;
//   [key: string]: any;
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

// export const getUsers = async (): Promise<User[]> => {
//   try {
//     const [page1, page2] = await Promise.all([
//       makeRequest<{ data: User[] }>("get", "/users?page=1"),
//       makeRequest<{ data: User[] }>("get", "/users?page=2"),
//     ]);
//     const reqresUsers = [...page1.data, ...page2.data];
//     const localUsers = storage.getLocalUsers();
//     return [...localUsers, ...reqresUsers];
//   } catch (error) {
//     handleApiError(error, "👥 Get Users");
//     throw new Error("Failed to fetch users."); // Unreachable but kept for clarity
//   }
// };

// export const getUserById = async (id: string): Promise<UserResponse> => {
//   try {
//     const localUsers = storage.getLocalUsers();
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

//     const response = await makeRequest<{ data: any }>("get", `/users/${id}`);
//     const u = response.data;
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
//   } catch (error) {
//     handleApiError(error, "👤 Get User");
//     throw new Error("Failed to fetch user details."); // Unreachable but kept for clarity
//   }
// };

// export const createUser = async (userData: Partial<User>): Promise<User> => {
//   try {
//     return await makeRequest<User>("post", "/users", userData);
//   } catch (error) {
//     handleApiError(error, "➕ Create User");
//     throw new Error("Failed to create user."); // Unreachable but kept for clarity
//   }
// };

// export const updateUser = async (
//   id: string,
//   userData: Partial<User>
// ): Promise<User> => {
//   try {
//     const response = await makeRequest<User>("put", `/users/${id}`, userData);
//     const localUsers = storage.getLocalUsers();
//     const index = localUsers.findIndex((user) => user.id === id);
//     if (index !== -1) {
//       localUsers[index] = { ...localUsers[index], ...userData };
//       storage.setLocalUsers(localUsers);
//     }
//     return response;
//   } catch (error) {
//     handleApiError(error, "✏️ Update User");
//     throw new Error("Failed to update user."); // Unreachable but kept for clarity
//   }
// };

// export const deleteUser = async (id: string): Promise<boolean> => {
//   try {
//     await makeRequest<void>("delete", `/users/${id}`);
//     const localUsers = storage.getLocalUsers();
//     const updated = localUsers.filter((user) => user.id !== id);
//     storage.setLocalUsers(updated);
//     return true;
//   } catch (error) {
//     handleApiError(error, "🗑️ Delete User");
//     throw new Error("Failed to delete user."); // Unreachable but kept for clarity
//   }
// };
import { storage } from "../utils/storage";
import { handleApiError } from "../utils/errorHandler";
import { makeRequest } from "@/lib/api";
import { ApiUserResponse, User, UserResponse } from "../lib/types";

export const getUsers = async (): Promise<User[]> => {
  try {
    const [page1, page2] = await Promise.all([
      makeRequest<{ data: User[] }>("get", "/users?page=1"),
      makeRequest<{ data: User[] }>("get", "/users?page=2"),
    ]);
    const reqresUsers = [...page1.data, ...page2.data];
    const localUsers = storage.getLocalUsers();
    return [...localUsers, ...reqresUsers];
  } catch (error) {
    handleApiError(error, "👥 Get Users");
    throw new Error("Failed to fetch users.");
  }
};

export const getUserById = async (id: string): Promise<UserResponse> => {
  try {
    const localUsers = storage.getLocalUsers();
    const localUser = localUsers.find((user) => user.id === id);
    if (localUser) {
      return {
        id: localUser.id,
        first_name: localUser.first_name || "N/A",
        last_name: localUser.last_name || "N/A",
        email: localUser.email,
        avatar: localUser.avatar || "N/A",
        role: localUser.role || "General Back Office",
        status: localUser.status || "Active",
        created_at: localUser.createdAt || new Date().toISOString(),
      };
    }

    const response = await makeRequest<ApiUserResponse>("get", `/users/${id}`);
    const u = response.data;
    return {
      id: u.id.toString(),
      first_name: u.first_name,
      last_name: u.last_name,
      email: u.email,
      avatar: u.avatar,
      role: u.role || "General Back Office",
      status: u.status || "Active",
      created_at: u.created_at || new Date().toISOString(),
    };
  } catch (error) {
    handleApiError(error, "👤 Get User");
    throw new Error("Failed to fetch user details.");
  }
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  try {
    return await makeRequest<User>("post", "/users", userData);
  } catch (error) {
    handleApiError(error, "➕ Create User");
    throw new Error("Failed to create user.");
  }
};

export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  try {
    const response = await makeRequest<User>("put", `/users/${id}`, userData);
    const localUsers = storage.getLocalUsers();
    const index = localUsers.findIndex((user) => user.id === id);
    if (index !== -1) {
      localUsers[index] = { ...localUsers[index], ...userData };
      storage.setLocalUsers(localUsers);
    }
    return response;
  } catch (error) {
    handleApiError(error, "✏️ Update User");
    throw new Error("Failed to update user.");
  }
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    await makeRequest<void>("delete", `/users/${id}`);
    const localUsers = storage.getLocalUsers();
    const updated = localUsers.filter((user) => user.id !== id);
    storage.setLocalUsers(updated);
    return true;
  } catch (error) {
    handleApiError(error, "🗑️ Delete User");
    throw new Error("Failed to delete user.");
  }
};
