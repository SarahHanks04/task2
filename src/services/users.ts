// import { storage } from "../utils/storage";
// import { handleApiError } from "../utils/errorHandler";
// import { makeRequest } from "@/lib/api";
// import { ApiUserResponse, User, UserResponse } from "../lib/types";
// import { DashboardUser } from "@/types/dashboard";

// // export const getUsers = async (): Promise<User[]> => {
// //   try {
// //     const [page1, page2] = await Promise.all([
// //       makeRequest<{ data: User[] }>("get", "/users?page=1"),
// //       makeRequest<{ data: User[] }>("get", "/users?page=2"),
// //     ]);
// //     const reqresUsers = [...page1.data, ...page2.data];
// //     const localUsers = storage.getLocalUsers();
// //     return [...localUsers, ...reqresUsers];
// //   } catch (error) {
// //     handleApiError(error, "👥 Get Users");
// //     throw new Error("Failed to fetch users.");
// //   }
// // };

// // Normalize User to DashboardUser
// const normalizeUser = (user: any): DashboardUser => ({
//   id: user.id.toString(),
//   first_name: user.first_name || "N/A",
//   last_name: user.last_name || "N/A",
//   email: user.email || "N/A",
//   avatar: user.avatar || "/images/default-avatar.png",
//   role: user.role || "General Back Office",
//   status: user.status || "Active",
//   created_at: user.created_at || new Date().toISOString(),
// });

// export const getUsers = async (): Promise<User[]> => {
//   try {
//     const [page1, page2] = await Promise.all([
//       makeRequest<{ data: User[] }>("get", "/users?page=1"),
//       makeRequest<{ data: User[] }>("get", "/users?page=2"),
//     ]);
//     const reqresUsers = [...page1.data, ...page2.data];
//     const localUsers = storage.getLocalUsers();
//     const allUsers = [...localUsers, ...reqresUsers];
//     return allUsers;
//   } catch (error) {
//     handleApiError(error, "👥 Get Users", "Failed to fetch users.");
//     throw new Error("Failed to fetch users.");
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
//         created_at: localUser.created_at || new Date().toISOString(),
//       };
//     }

//     const response = await makeRequest<ApiUserResponse>("get", `/users/${id}`);
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
//     throw new Error("Failed to fetch user details.");
//   }
// };

// export const createUser = async (userData: Partial<User>): Promise<User> => {
//   try {
//     return await makeRequest<User>("post", "/users", userData);
//   } catch (error) {
//     handleApiError(error, "➕ Create User");
//     throw new Error("Failed to create user.");
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
//     throw new Error("Failed to update user.");
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
//     throw new Error("Failed to delete user.");
//   }
// };



import { makeRequest } from "@/lib/api";
import { DashboardUser } from "@/types/dashboard";
import { handleApiError } from "@/utils/errorHandler";
import { storage } from "@/utils/storage";

// Normalize user data to DashboardUser
const normalizeUser = (user: any): DashboardUser => ({
  id: user.id.toString(),
  first_name: user.first_name || "N/A",
  last_name: user.last_name || "N/A",
  email: user.email || "N/A",
  avatar: user.avatar || "/images/default-avatar.png",
  role: user.role || "General Back Office",
  status: user.status || "Active",
  created_at: user.created_at || new Date().toISOString(),
});

export const getUsers = async (): Promise<DashboardUser[]> => {
  try {
    const [page1, page2] = await Promise.all([
      makeRequest<{ data: any[] }>("get", "/users?page=1"),
      makeRequest<{ data: any[] }>("get", "/users?page=2"),
    ]);
    const reqresUsers = [...page1.data, ...page2.data];
    const localUsers = storage.getLocalUsers();
    const allUsers = [...localUsers, ...reqresUsers].map(normalizeUser);
    return allUsers;
  } catch (error) {
    handleApiError(error, "👥 Get Users", "Failed to fetch users.");
    throw new Error("Failed to fetch users.");
  }
};

export const getUserById = async (id: string): Promise<DashboardUser> => {
  try {
    const localUsers = storage.getLocalUsers();
    const localUser = localUsers.find((user) => user.id === id);
    if (localUser) {
      return normalizeUser(localUser);
    }

    const response = await makeRequest<{ data: any }>("get", `/users/${id}`);
    return normalizeUser(response.data);
  } catch (error) {
    handleApiError(error, "👤 Get User", "Failed to fetch user details.");
    throw new Error("Failed to fetch user details.");
  }
};

export const createUser = async (userData: Partial<DashboardUser>): Promise<DashboardUser> => {
  try {
    const response = await makeRequest<any>("post", "/users", userData);
    return normalizeUser(response);
  } catch (error) {
    handleApiError(error, "➕ Create User", "Failed to create user.");
    throw new Error("Failed to create user.");
  }
};

export const updateUser = async (
  id: string,
  userData: Partial<DashboardUser>
): Promise<DashboardUser> => {
  try {
    const response = await makeRequest<any>("put", `/users/${id}`, userData);
    const updatedUser = normalizeUser({ ...response, ...userData });
    const localUsers = storage.getLocalUsers();
    const index = localUsers.findIndex((user) => user.id === id);
    if (index !== -1) {
      localUsers[index] = updatedUser;
      storage.setLocalUsers(localUsers);
    }
    return updatedUser;
  } catch (error) {
    handleApiError(error, "✏️ Update User", "Failed to update user.");
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
    handleApiError(error, "🗑️ Delete User", "Failed to delete user.");
    throw new Error("Failed to delete user.");
  }
};