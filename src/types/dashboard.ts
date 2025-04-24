export interface DashboardUser {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  created_at: string;
  email: string;
  avatar: string;
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
  selectedUser: DashboardUser | null;
  loading: boolean;
  error: string | null;
  totalUsers: number;
  totalPages: number;
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

// Types for ChartsAndTables
export interface UserActivity {
  month: string;
  count: number;
}

export interface StatusData {
  label: string;
  value: number;
  color: string;
}

export interface ChartsAndTablesProps {
  roleData: RoleData;
  users: DashboardUser[];
}

// Types for RecentActivity
export interface UserAction {
  id: string;
  actionType: "added" | "updated" | "deleted";
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
  timestamp: string;
  details?: Record<string, any>;
}

export interface RecentActivityProps {
  recentUsers: DashboardUser[];
}

export interface UserProps {
  params: Promise<{ id: string }>;
}

// For SearchComponent, Pagination, EllipsisDropdown
export interface SearchComponentProps {
  users: DashboardUser[];
  onFilteredUsers: (users: DashboardUser[]) => void;
  onUserAdded: (user: DashboardUser) => void;
}

export interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export interface EllipsisDropdownProps {
  user: DashboardUser;
  onEdit: (user: DashboardUser) => void;
  users: DashboardUser[];
  setUsers: (users: DashboardUser[]) => void;
  setFilteredUsers: (users: DashboardUser[]) => void;
}
