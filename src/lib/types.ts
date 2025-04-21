export interface User {
  id: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface LoginResponse {
  token: string;
  name?: string;
}

export interface RegisterResponse {
  id: string;
  token: string;
}

export interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
  created_at: string;
}

export interface ErrorDetails {
  message: string;
  status?: number;
  data?: any;
}

export interface ApiUserResponse {
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    role?: string;
    status?: string;
    created_at?: string;
  };
}
