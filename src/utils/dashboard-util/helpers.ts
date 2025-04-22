import {
  DashboardUser,
  RoleData,
  StatusData,
  UserActivity,
} from "@/types/dashboard";

export const getNewUsers = (users: DashboardUser[]): number => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  return users.filter((user) => new Date(user.created_at) >= twoDaysAgo).length;
};

export const getActiveUsers = (users: DashboardUser[]): number => {
  return users.filter(
    (user) => (user.status || "Active").toLowerCase() === "active"
  ).length;
};

export const getRoleDistribution = (users: DashboardUser[]): RoleData => {
  const roleCounts = users.reduce((acc, user) => {
    const role = user.role || "General Back Office";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        data: Object.values(roleCounts),
        backgroundColor: ["#4A90E2", "#FF6B6B", "#FFD93D", "#1ABC9C"],
        hoverBackgroundColor: ["#4A90E2", "#FF6B6B", "#FFD93D", "#1ABC9C"],
      },
    ],
  };
};

export const getGreetingMessage = (
  loggedInUser: { name: string } | null
): string => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  return loggedInUser
    ? `${greeting}, ${loggedInUser.name}`
    : `${greeting}, User`;
};

export const getUserActivity = (users: DashboardUser[]): UserActivity[] => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.map((month, index) => ({
    month,
    count: users.filter((user) => {
      const createdAt = new Date(user.created_at || new Date().toISOString());
      return createdAt.getMonth() === index;
    }).length,
  }));
};

export const getStatusData = (users: DashboardUser[]): StatusData[] => {
  const statusCounts = users.reduce((acc, user) => {
    const status = (user.status || "Active").toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const totalStatusUsers = Object.values(statusCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  return Object.keys(statusCounts).map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: totalStatusUsers
      ? Math.round((statusCounts[status] / totalStatusUsers) * 100)
      : 0,
    color:
      status === "active"
        ? "#4A90E2"
        : status === "inactive"
        ? "#FF6B6B"
        : "#FFD93D",
  }));
};
