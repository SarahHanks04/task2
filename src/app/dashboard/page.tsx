"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setUsers, setError } from "@/redux/slices/userSlice";
import {
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectLoggedInUser,
  selectTotalUsers,
} from "@/redux/selectors/userSelectors";
import { useLastSeen } from "@/hooks/useLastSeen";
import { DashboardUser } from "@/types/dashboard";
import Loading from "../loading";
import FilterBar from "@/components/filterBar";
import { AppDispatch } from "@/redux/store";
import SummaryCards from "@/utils/dashboard-util/summaryCards";
import {
  getNewUsers,
  getActiveUsers,
  getRoleDistribution,
  getGreetingMessage,
} from "@/utils/dashboard-util/helpers";
import ChartsAndTables from "@/utils/dashboard-util/chartsAndTables";
import RecentActivity from "@/utils/dashboard-util/recentActivities";
import { getUsers } from "@/services/users";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const loggedInUser = useSelector(selectLoggedInUser);
  const totalUsers = useSelector(selectTotalUsers);
  const lastSeen = useLastSeen();
  const [filteredUsers, setFilteredUsers] = useState<DashboardUser[]>(users);

  useEffect(() => {
    const fetchAllUsers = async () => {
      dispatch(setLoading());
      try {
        const {
          users: fetchedUsers,
          total,
          total_pages,
        } = await getUsers(1, 100);
        dispatch(setUsers({ users: fetchedUsers, total, total_pages }));
        setFilteredUsers(fetchedUsers);
      } catch (err) {
        dispatch(
          setError(err instanceof Error ? err.message : "Failed to fetch users")
        );
      }
    };
    fetchAllUsers();
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Metrics
  const newUsers = getNewUsers(filteredUsers);
  const activeUsers = getActiveUsers(filteredUsers);

  // Role distribution
  const roleData = getRoleDistribution(filteredUsers);

  // Recent users
  const recentUsers = filteredUsers.slice(0, 3);

  // Greetings
  const welcomeMessage = getGreetingMessage(loggedInUser);

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Header welcomeMessage={welcomeMessage} lastSeen={lastSeen} />
      <FilterBar users={users} onFilter={setFilteredUsers} />
      <SummaryCards
        totalUsers={totalUsers}
        newUsers={newUsers}
        activeUsers={activeUsers}
      />
      <ChartsAndTables roleData={roleData} users={filteredUsers} />
      <RecentActivity recentUsers={recentUsers} />
    </div>
  );
}

interface HeaderProps {
  welcomeMessage: string;
  lastSeen: Date | null;
}

const Header = ({ welcomeMessage, lastSeen }: HeaderProps) => (
  <div className="mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 sm:gap-4">
      <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left text-[#11453B]">
        {welcomeMessage}
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
        {lastSeen
          ? `Last Seen: ${lastSeen.toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}`
          : "First Visit"}
      </p>
    </div>
  </div>
);
