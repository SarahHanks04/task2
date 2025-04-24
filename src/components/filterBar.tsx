"use client";

import { useState, ChangeEvent } from "react";
import { DashboardUser } from "@/types/dashboard";

interface FilterBarProps {
  users: DashboardUser[];
  onFilter: (filteredUsers: DashboardUser[]) => void;
}

export default function FilterBar({ users, onFilter }: FilterBarProps) {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const handleFilter = () => {
    const filtered = users.filter((user) => {
      const roleMatch = !role || user.role === role;
      const statusMatch = !status || user.status === status;
      return roleMatch && statusMatch;
    });
    onFilter(filtered);
  };

  const handleReset = () => {
    setRole("");
    setStatus("");
    onFilter(users);
  };

  // Unique roles
  const uniqueRoles = [...new Set(users.map((user) => user.role))].filter(
    Boolean
  );

  return (
    <div className="w-full mb-10 pt-6">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 items-start sm:items-end">
        {/* Role Filter */}
        <div className="w-full sm:w-auto">
          <label
            htmlFor="role-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <select
            id="role-filter"
            value={role}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setRole(e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#11453B] focus:border-[#11453B] text-sm text-gray-500"
            aria-label="Filter by role"
          >
            <option value="" className="text-gray-500">All Roles</option>
            {uniqueRoles.map((role) => (
              <option key={role} value={role} className="text-gray-500">
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setStatus(e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#11453B] focus:border-[#11453B] text-sm text-gray-500"
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleFilter}
            className="w-full sm:w-auto px-4 py-2 bg-[#11453B] text-white rounded-md hover:bg-[#0d3b33] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-[#11453B] transition-colors text-sm"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-gray-500 transition-colors text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
