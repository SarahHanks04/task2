import { v4 as uuidv4 } from "uuid";
import { storage } from "../utils/storage";
import { User } from "../lib/types";

export const MockUserService = {
  findUser(email: string, password: string): User | undefined {
    const users = storage.cleanUpExpiredUsers();
    return users.find((u) => u.email === email && u.password === password);
  },

  addUser(email: string, password: string, name?: string): User {
    const newUser: User = {
      id: Math.floor(Math.random() * 1000).toString(),
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };
    const users = storage.getMockedUsers();
    users.push(newUser);
    storage.setMockedUsers(users);
    return newUser;
  },

  generateToken(): string {
    return `mock-token-${uuidv4()}`;
  },
};
