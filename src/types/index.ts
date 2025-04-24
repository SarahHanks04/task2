export interface User {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  password?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// export interface UserAction {
//   id: number;
//   actionType: string;
//   user: Pick<User, "id" | "first_name" | "last_name">;
//   timestamp: string;
//   details?: Record<string, unknown>;
// }

export interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

export interface SidebarState {
  isCollapsed: boolean;
  isMobileMenuOpen: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface ApiError {
  error: string;
}
