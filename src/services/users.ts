import { makeRequest } from "@/lib/api";
import { DashboardUser } from "@/types/dashboard";
import { handleApiError } from "@/utils/errorHandler";
import { storage } from "@/utils/storage";

// Normalize user data
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

const deduplicateUsers = (
  localUsers: DashboardUser[],
  apiUsers: any[]
): DashboardUser[] => {
  const userMap = new Map<string, DashboardUser>();

  localUsers.forEach((user) => userMap.set(user.id, normalizeUser(user)));

  // Add API users
  apiUsers.forEach((user) => {
    if (!userMap.has(user.id.toString())) {
      userMap.set(user.id.toString(), normalizeUser(user));
    }
  });

  return Array.from(userMap.values());
};

// Interface for paginated response
interface PaginatedUsers {
  users: DashboardUser[];
  total: number;
  total_pages: number;
}

export const getUsers = async (
  page: number = 1,
  per_page: number = 6
): Promise<PaginatedUsers> => {
  try {
    // Fetch users
    const response = await makeRequest<{
      data: any[];
      total: number;
      total_pages: number;
      page: number;
      per_page: number;
    }>("get", `/users?page=${page}&per_page=${per_page}`);

    const apiUsers = response.data;
    const localUsers = storage.getLocalUsers();

    const allUsers = deduplicateUsers(localUsers, apiUsers);

    // Calculate pagination
    const startIndex = (page - 1) * per_page;
    const paginatedUsers = allUsers.slice(startIndex, startIndex + per_page);

    // Total users
    const total = allUsers.length;
    const total_pages = Math.ceil(total / per_page);

    return {
      users: paginatedUsers,
      total,
      total_pages,
    };
  } catch (error) {
    handleApiError(error, "Get Users", "Failed to fetch users.");
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
    handleApiError(error, "Get User", "Failed to fetch user details.");
    throw new Error("Failed to fetch user details.");
  }
};

export const createUser = async (
  userData: Partial<DashboardUser>
): Promise<DashboardUser> => {
  try {
    const response = await makeRequest<any>("post", "/users", userData);
    const newUser = normalizeUser({ ...response, ...userData });
    const localUsers = storage.getLocalUsers();
    const updatedLocalUsers = localUsers.filter(
      (user) => user.id !== newUser.id
    );
    updatedLocalUsers.push(newUser);
    storage.setLocalUsers(updatedLocalUsers);
    return newUser;
  } catch (error) {
    handleApiError(error, "Create User", "Failed to create user.");
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
    const updatedLocalUsers = localUsers.map((user) =>
      user.id === id ? updatedUser : user
    );
    storage.setLocalUsers(updatedLocalUsers);
    return updatedUser;
  } catch (error) {
    handleApiError(error, "Update User", "Failed to update user.");
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
    handleApiError(error, "Delete User", "Failed to delete user.");
    throw new Error("Failed to delete user.");
  }
};
