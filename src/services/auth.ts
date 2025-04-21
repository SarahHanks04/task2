// import { v4 as uuidv4 } from "uuid";
// import { handleApiError } from "../utils/errorHandler";
// import { storage } from "../utils/storage";
// import { makeRequest } from "@/lib/api";
// import { MockUserService } from "./mockUserServices";

// // Types
// interface User {
//   id: string;
//   email: string;
//   password: string;
//   createdAt?: string;
//   [key: string]: any;
// }

// interface LoginResponse {
//   token: string;
// }

// interface RegisterResponse {
//   id: string;
//   token: string;
// }

// export const loginUser = async (
//   email: string,
//   password: string
// ): Promise<LoginResponse> => {
//   try {
//     return await makeRequest<LoginResponse>("post", "/login", {
//       email,
//       password,
//     });
//   } catch (error: any) {
//     const user = MockUserService.findUser(email, password);
//     if (user) {
//       return { token: MockUserService.generateToken() };
//     }

//     const errorMessage =
//       error?.response?.data?.error === "user not found"
//         ? "User not found. Please register first."
//         : "Login failed. Please check your credentials.";

//     handleApiError(error, "🔐 Login");
//     throw new Error(errorMessage);
//   }
// };

// export const registerUser = async (
//   email: string,
//   password: string
// ): Promise<RegisterResponse> => {
//   try {
//     return await makeRequest<RegisterResponse>("post", "/register", {
//       email,
//       password,
//     });
//   } catch (error: any) {
//     const err = error.response?.data?.error;
//     if (err === "Note: Only defined users succeed registration") {
//       const newUser = MockUserService.addUser(email, password);
//       return {
//         id: newUser.id,
//         token: MockUserService.generateToken(),
//       };
//     }

//     const errorMessage =
//       err === "Missing password"
//         ? "Password is required."
//         : err === "Missing email or username"
//         ? "Email is required."
//         : "Registration failed. Please try again.";

//     handleApiError(error, "🔐 Registration");
//     throw new Error(errorMessage);
//   }
// };

import { handleApiError } from "../utils/errorHandler";
import { makeRequest } from "@/lib/api";
import { MockUserService } from "./mockUserServices";
import { LoginResponse, RegisterResponse } from "../lib/types";

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    return await makeRequest<LoginResponse & { name?: string }>(
      "post",
      "/login",
      {
        email,
        password,
      }
    );
  } catch (error: any) {
    const user = MockUserService.findUser(email, password);
    if (user) {
      return { token: MockUserService.generateToken(), name: user.name };
    }

    const errorMessage =
      error?.response?.data?.error === "user not found"
        ? "User not found. Please register first."
        : "Login failed. Please check your credentials.";

    handleApiError(error, "🔐 Login");
    throw new Error(errorMessage);
  }
};

export const registerUser = async (
  email: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    return await makeRequest<RegisterResponse>("post", "/register", {
      email,
      password,
    });
  } catch (error: any) {
    const err = error.response?.data?.error;
    if (err === "Note: Only defined users succeed registration") {
      const newUser = MockUserService.addUser(email, password);
      return {
        id: newUser.id,
        token: MockUserService.generateToken(),
      };
    }

    const errorMessage =
      err === "Missing password"
        ? "Password is required."
        : err === "Missing email or username"
        ? "Email is required."
        : "Registration failed. Please try again.";

    handleApiError(error, "🔐 Registration");
    throw new Error(errorMessage);
  }
};
