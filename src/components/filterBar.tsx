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
    let filtered = users;
    if (role) {
      filtered = filtered.filter((user) => user.role === role);
    }
    if (status) {
      filtered = filtered.filter((user) => user.status === status);
    }
    onFilter(filtered);
  };

  return (
    <div className="mb-6 flex gap-4">
      <select
        value={role}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setRole(e.target.value)
        }
        className="p-2 border rounded"
      >
        <option value="">All Roles</option>
        {[...new Set(users.map((user) => user.role))].map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setStatus(e.target.value)
        }
        className="p-2 border rounded"
      >
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <button
        onClick={handleFilter}
        className="bg-[#11453B] text-white p-2 rounded hover:bg-[#0d3b33]"
      >
        Apply Filters
      </button>
    </div>
  );
}
