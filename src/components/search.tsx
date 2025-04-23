"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { SearchComponentProps } from "@/types/dashboard";
import { filterUsers } from "@/utils/dashboard-util/helpers";
import AddUserButton from "@/app/users/users-util/add-users-button";

// Reusable search input component
const SearchInput = ({
  searchQuery,
  setSearchQuery,
  clearSearch,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  clearSearch: () => void;
}) => (
  <div className="relative w-1/3">
    <input
      type="text"
      placeholder="Search Users"
      className="pl-10 pr-10 py-2 border rounded w-full focus:outline-none"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <Search
      size={18}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
    />
    {searchQuery && (
      <button
        onClick={clearSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    )}
  </div>
);

export default function SearchComponent({
  users,
  onFilteredUsers,
  onUserAdded,
}: SearchComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users when searchQuery or users change
  useEffect(() => {
    const filtered = filterUsers(users, searchQuery);
    onFilteredUsers(filtered);
  }, [searchQuery, users, onFilteredUsers]);

  // Clear search input
  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Check if there are no results
  const hasNoResults =
    searchQuery && filterUsers(users, searchQuery).length === 0;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between space-x-4">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
        />
        <AddUserButton onUserAdded={onUserAdded} />
      </div>
      {hasNoResults && (
        <div className="text-center py-4 text-gray-500">
          No users found matching "{searchQuery}".
        </div>
      )}
    </div>
  );
}
