import { v4 as uuidv4 } from "uuid";
import { storage } from "../utils/storage";
import { User } from "../lib/types";
import { DashboardUser } from "@/types/dashboard";

// Mock authentication
interface MockAuthUser {
  email: string;
  password: string;
}

const MOCK_AUTH_KEY = "mockAuthUsers";

const getMockAuthUsers = (): MockAuthUser[] => {
  return JSON.parse(localStorage.getItem(MOCK_AUTH_KEY) || "[]");
};

const setMockAuthUsers = (users: MockAuthUser[]): void => {
  localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(users));
};

export const MockUserService = {
  findUser(email: string, password: string): User | undefined {
    const authUsers = getMockAuthUsers();
    const authUser = authUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (!authUser) return undefined;

    // Find DashboardUser in mockedUsers
    const users = storage.cleanUpExpiredUsers(); 
    const dashboardUser = users.find((u) => u.email === authUser.email);

    if (!dashboardUser) return undefined;

    // User object 
    return {
      id: dashboardUser.id,
      email: dashboardUser.email,
      password, 
      first_name: dashboardUser.first_name,
      last_name: dashboardUser.last_name,
      avatar: dashboardUser.avatar,
      role: dashboardUser.role,
      status: dashboardUser.status,
      created_at: dashboardUser.created_at,
      name: `${dashboardUser.first_name} ${dashboardUser.last_name}`.trim(),
    };
  },

  addUser(email: string, password: string, name?: string): User {
    const id = Math.floor(Math.random() * 1000).toString();
    
    const [first_name, ...last_name_parts] = name ? name.split(" ") : ["User", ""];
    const last_name = last_name_parts.join(" ") || "Unknown";

    // DashboardUser for storage
    const newDashboardUser: DashboardUser = {
      id,
      email,
      first_name,
      last_name,
      role: "General Back Office",
      status: "Active",
      created_at: new Date().toISOString(),
      avatar: "/images/default-avatar.jpg",
    };

    const users = storage.getMockedUsers();
    users.push(newDashboardUser);
    storage.setMockedUsers(users);

    const authUsers = getMockAuthUsers();
    authUsers.push({ email, password });
    setMockAuthUsers(authUsers);

    // Return User object
    return {
      id,
      email,
      password,
      first_name,
      last_name,
      name: name || `${first_name} ${last_name}`.trim(),
      created_at: newDashboardUser.created_at,
      avatar: newDashboardUser.avatar,
      role: newDashboardUser.role,
      status: newDashboardUser.status,
    };
  },

  generateToken(): string {
    return `mock-token-${uuidv4()}`;
  },
};