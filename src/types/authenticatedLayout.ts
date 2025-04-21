import { RootState } from "@/redux/store";

export interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export type AuthState = Pick<RootState, "auth">["auth"];
