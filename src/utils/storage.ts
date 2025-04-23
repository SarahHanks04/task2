// // interface User {
// //   id: string;
// //   email: string;
// //   password: string;
// //   createdAt?: string;
// //   [key: string]: any;
// // }

// // export const storage = {
// //   getMockedUsers(): User[] {
// //     return JSON.parse(localStorage.getItem("mockedUsers") || "[]");
// //   },

// //   setMockedUsers(users: User[]): void {
// //     localStorage.setItem("mockedUsers", JSON.stringify(users));
// //   },

// //   getLocalUsers(): User[] {
// //     return JSON.parse(localStorage.getItem("localUsers") || "[]");
// //   },

// //   setLocalUsers(users: User[]): void {
// //     localStorage.setItem("localUsers", JSON.stringify(users));
// //   },

// //   cleanUpExpiredUsers(): User[] {
// //     const users = this.getMockedUsers();
// //     const now = new Date();
// //     const expirationTime = 24 * 60 * 60 * 1000;

// //     const validUsers = users.filter((user) => {
// //       const createdAt = new Date(user.createdAt || now);
// //       return now.getTime() - createdAt.getTime() <= expirationTime;
// //     });

// //     this.setMockedUsers(validUsers);
// //     return validUsers;
// //   },
// // };

// import { DashboardUser } from "@/types/dashboard";
// import { User } from "../lib/types";

// export const storage = {
//   getMockedUsers(): User[] {
//     return JSON.parse(localStorage.getItem("mockedUsers") || "[]");
//   },

//   setMockedUsers(users: User[]): void {
//     localStorage.setItem("mockedUsers", JSON.stringify(users));
//   },

//   // getLocalUsers(): User[] {
//   //   return JSON.parse(localStorage.getItem("localUsers") || "[]");
//   // },

//   // setLocalUsers(users: User[]): void {
//   //   localStorage.setItem("localUsers", JSON.stringify(users));
//   // },
//   getLocalUsers: (): DashboardUser[] => {
//     const users = localStorage.getItem("localUsers");
//     return users ? JSON.parse(users) : [];
//   },
//   setLocalUsers: (users: DashboardUser[]) => {
//     localStorage.setItem("localUsers", JSON.stringify(users));
//   },

//   cleanUpExpiredUsers(): User[] {
//     const users = storage.getMockedUsers();
//     const now = new Date();
//     const expirationTime = 24 * 60 * 60 * 1000;

//     const validUsers = users.filter((user) => {
//       const createdAt = new Date(user.created_at || now);
//       return now.getTime() - createdAt.getTime() <= expirationTime;
//     });

//     storage.setMockedUsers(validUsers);
//     return validUsers;
//   },
// };

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