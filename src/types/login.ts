export interface LoginFormValues {
  email: string;
  password: string;
}

export interface MockedUser {
  id: string;
  email: string;
  name?: string;
  password: string;
  createdAt: string;
}

export interface LoginSuccessPayload {
  user: {
    email: string;
    name: string;
  };
  token: string;
}
