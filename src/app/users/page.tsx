"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { setLoading, setUsers, setError } from "@/redux/slices/userSlice";
import { logUserAction } from "@/redux/slices/userActionsSlice";
import { getUsers, updateUser } from "@/services/users";
import { RootState, AppDispatch } from "@/redux/store";
import {
  DashboardUser,
  SearchComponentProps,
  PaginationProps,
  EllipsisDropdownProps,
} from "@/types/dashboard";
import Loading from "@/app/loading";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/dashboard-util/helpers";
import SearchComponent from "@/components/search";
import Pagination from "@/components/pagination";
import EllipsisDropdown from "@/components/ellipsisDropdown";


// Reusable StatusBadge component
function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = (status || "Active").toLowerCase();
  const badgeStyles: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        badgeStyles[normalizedStatus] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status || "Active"}
    </span>
  );
}

// Table column configuration
interface ColumnConfig {
  key: keyof DashboardUser | "name" | "actions";
  label: string;
  render: (
    user: DashboardUser,
    isEditing: boolean,
    formProps: FormProps
  ) => React.ReactNode;
}

interface FormProps {
  register: ReturnType<typeof useForm<DashboardUser>>["register"];
  errors: ReturnType<typeof useForm<DashboardUser>>["formState"]["errors"];
}

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );
  const { user: loggedInUser } = useSelector((state: RootState) => state.auth);
  const [filteredUsers, setFilteredUsers] = useState<DashboardUser[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DashboardUser>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "General Back Office",
      status: "Active",
      created_at: new Date().toISOString().split("T")[0],
    },
  });

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoading());
      try {
        const data = await getUsers();
        dispatch(setUsers(data));
        setFilteredUsers(data);
      } catch (err) {
        dispatch(
          setError(err instanceof Error ? err.message : "Failed to fetch users")
        );
      }
    };
    fetchUsers();
  }, [dispatch]);

  // Update state and localStorage
  const updateUsers = (
    newUsers: DashboardUser[],
    action: "added" | "updated",
    updatedUser?: DashboardUser
  ) => {
    dispatch(setUsers(newUsers));
    setFilteredUsers(newUsers);
    localStorage.setItem("localUsers", JSON.stringify(newUsers));
    if (updatedUser) {
      dispatch(
        logUserAction({
          actionType: action,
          user: {
            id: updatedUser.id,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
          },
          details:
            action === "updated"
              ? { updatedFields: Object.keys(updatedUser) }
              : undefined,
        })
      );
    }
  };

  // Handle user update
  const onEditSave: SubmitHandler<DashboardUser> = async (data) => {
    if (!editingUserId) return;
    try {
      const updatedUserData = {
        ...data,
        id: editingUserId,
        avatar:
          users.find((u) => u.id === editingUserId)?.avatar ||
          "/images/default-avatar.jpg",
      };
      const response = await updateUser(editingUserId, updatedUserData);
      const updatedUsers = users.map((user) =>
        user.id === editingUserId ? { ...response, ...updatedUserData } : user
      );
      updateUsers(updatedUsers, "updated", updatedUserData);
      setEditingUserId(null);
      reset();
      toast.success("User updated successfully!", { duration: 2000 });
    } catch (error) {
      toast.error(
        `Failed to update user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { duration: 3000 }
      );
    }
  };

  // Start editing
  const onEditStart = (user: DashboardUser) => {
    setEditingUserId(user.id);
    reset({
      ...user,
      created_at: user.created_at
        ? new Date(user.created_at).toISOString().split("T")[0]
        : "2025-04-08",
    });
  };

  // Cancel editing
  const onEditCancel = () => {
    setEditingUserId(null);
    reset();
  };

  // Handle user added
  const handleUserAdded = (newUser: DashboardUser) => {
    const updatedUsers = [newUser, ...users];
    updateUsers(updatedUsers, "added", newUser);
  };

  // Table columns
  const columns: ColumnConfig[] = useMemo(
    () => [
      {
        key: "name",
        label: "NAME",
        render: (user, isEditing, { register, errors }) =>
          isEditing ? (
            <div className="flex flex-col sm:flex-row sm:space-x-2">
              <div>
                <input
                  type="text"
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                  className="p-1 border rounded w-full sm:w-24"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                  className="p-1 border rounded w-full sm:w-24"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <Link href={`/users/${user.id}`}>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <Image
                    src={user.avatar || "/images/default-avatar.jpg"}
                    alt={`${user.first_name} ${user.last_name}`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                    {user.first_name} {user.last_name}
                  </span>
                </div>
              </div>
            </Link>
          ),
      },
      {
        key: "email",
        label: "EMAIL",
        render: (user, isEditing, { register, errors }) =>
          isEditing ? (
            <div>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className="p-1 border rounded w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          ) : (
            user.email
          ),
      },
      {
        key: "role",
        label: "ROLE",
        render: (user, isEditing, { register }) =>
          isEditing ? (
            <select
              {...register("role", { required: "Role is required" })}
              className="p-1 border rounded w-full"
            >
              <option value="General Back Office">General Back Office</option>
              <option value="Admin">Admin</option>
              <option value="General Partner">General Partner</option>
              <option value="Wealth Manager">Wealth Manager</option>
            </select>
          ) : (
            user.role || "General Back Office"
          ),
      },
      {
        key: "created_at",
        label: "CREATED ON",
        render: (user, isEditing, { register }) =>
          isEditing ? (
            <input
              type="date"
              {...register("created_at", {
                required: "Created date is required",
              })}
              className="p-1 border rounded w-full"
            />
          ) : (
            formatDate(user.created_at, "short")
          ),
      },
      {
        key: "status",
        label: "STATUS",
        render: (user, isEditing, { register }) =>
          isEditing ? (
            <select
              {...register("status", { required: "Status is required" })}
              className="p-1 border rounded w-full"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          ) : (
            <StatusBadge status={user.status} />
          ),
      },
      {
        key: "actions",
        label: "ACTIONS",
        render: (user, isEditing) =>
          isEditing ? (
            <div className="flex justify-end space-x-2 text-xs">
              <button
                onClick={handleSubmit(onEditSave)}
                className="px-3 py-1 bg-[#11453B] text-white rounded hover:bg-[#0d3a2f]"
              >
                Save
              </button>
              <button
                onClick={onEditCancel}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <EllipsisDropdown
              user={user}
              onEdit={onEditStart}
              users={users}
              setUsers={(updatedUsers) => dispatch(setUsers(updatedUsers))}
              setFilteredUsers={setFilteredUsers}
            />
            </div>
          ),
      },
    ],
    [
      users,
      editingUserId,
      register,
      errors,
      handleSubmit,
      onEditCancel,
      onEditStart,
    ]
  );

  // Pagination
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="btn-group-container mb-4">
        <div className="btn-group flex space-x-2">
          <button className="btn admin-btn px-4 py-2 bg-[#11453B] text-white rounded hover:bg-[#0d3a2f]">
            ADMINISTRATION
          </button>
          <button className="btn px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            GENERAL PARTNERS
          </button>
          <button className="btn px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            WEALTH MANAGERS
          </button>
        </div>
      </div>

      <SearchComponent
        users={users}
        onFilteredUsers={setFilteredUsers}
        onUserAdded={handleUserAdded}
      />

      <div className="overflow-x-auto pt-4">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-sm">
            <tr>
              <th className="px-6 py-3">
                <input type="checkbox" className="rounded cursor-pointer" />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className={
                  editingUserId === user.id
                    ? "bg-[#fefce8] border-l-4 border-yellow-500"
                    : "hover:bg-gray-50"
                }
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded cursor-pointer" />
                </td>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {col.render(user, editingUserId === user.id, {
                      register,
                      errors,
                    })}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
