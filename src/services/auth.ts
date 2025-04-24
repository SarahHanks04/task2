import { handleApiError } from "../utils/errorHandler";
import { makeRequest } from "@/lib/api";
import { MockUserService } from "./mockUserServices";
import { LoginResponse, RegisterResponse } from "../lib/types";
import { AxiosError } from "axios";

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
  } catch (error: unknown) {
    const user = MockUserService.findUser(email, password);
    if (user) {
      return { token: MockUserService.generateToken(), name: user.name };
    }

    let errorMessage = "Login failed. Please check your credentials.";
    if (error instanceof AxiosError) {
      errorMessage =
        error.response?.data?.error === "user not found"
          ? "User not found. Please register first."
          : errorMessage;
    }

    handleApiError(error as AxiosError | Error, "🔐 Login");
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
  } catch (error: unknown) {
    let err: string | undefined;
    if (error instanceof AxiosError) {
      err = error.response?.data?.error;
    }

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

    handleApiError(error as AxiosError | Error, "🔐 Registration");
    throw new Error(errorMessage);
  }
};
