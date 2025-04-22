export interface DashboardUser {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  created_at: string;
}

export interface RoleData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

export interface UserState {
  users: DashboardUser[];
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: { name: string } | null;
}

// Types for SummaryCards
export interface SummaryCardConfig {
  title: string;
  value: number;
  icon: React.ComponentType<{ size?: number }>;
  borderColor: string;
  progressColor?: string;
  progressWidth?: (value: number, total: number) => string;
}

export interface SummaryCardsProps {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
}
