import { DashboardUser } from "@/types/dashboard";

export const storage = {
  getMockedUsers: (): DashboardUser[] => {
    return JSON.parse(localStorage.getItem("mockedUsers") || "[]");
  },

  setMockedUsers: (users: DashboardUser[]): void => {
    localStorage.setItem("mockedUsers", JSON.stringify(users));
  },

  getLocalUsers: (): DashboardUser[] => {
    return JSON.parse(localStorage.getItem("localUsers") || "[]");
  },

  setLocalUsers: (users: DashboardUser[]): void => {
    localStorage.setItem("localUsers", JSON.stringify(users));
  },

  cleanUpExpiredUsers: (): DashboardUser[] => {
    const users = storage.getMockedUsers();
    const now = new Date();
    const expirationTime = 24 * 60 * 60 * 1000;

    const validUsers = users.filter((user) => {
      const createdAt = new Date(user.created_at || now);
      return now.getTime() - createdAt.getTime() <= expirationTime;
    });

    storage.setMockedUsers(validUsers);
    return validUsers;
  },
};