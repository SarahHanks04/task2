// src/components/EllipsisDropdown.tsx
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  EllipsisVertical,
  User,
  Pencil,
  Trash2,
  CloudDownload,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import { useDispatch } from "react-redux";
import { deleteUser } from "@/services/users";
import { logUserAction } from "@/redux/slices/userActionsSlice";
import { EllipsisDropdownProps } from "@/types/dashboard";
// import { updateLocalStorage } from "@/util/storage";
// import "@/styles/userTable.css";
import { formatDate } from "@/utils/dashboard-util/helpers";
import { storage } from "@/utils/storage";

// Menu action type
interface MenuAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  className?: string;
  isLink?: boolean;
  href?: string;
}

// Reusable menu item component
const MenuItem = ({
  label,
  icon: Icon,
  onClick,
  className = "",
  isLink = false,
  href,
}: MenuAction) => {
  const content = (
    <button
      onClick={onClick}
      className={`dropdown-item flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${className}`}
      aria-label={label}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </button>
  );

  return isLink && href ? (
    <Link href={href} onClick={onClick}>
      {content}
    </Link>
  ) : (
    content
  );
};

// Reusable confirmation toast component
const ConfirmationToast = ({
  user,
  onConfirm,
  onCancel,
}: {
  user: { first_name: string; last_name: string };
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="dropdown-toast max-w-md w-full bg-white shadow-lg rounded-lg border border-red-200 animate-enter">
    <div className="flex items-start p-4">
      <div className="flex-shrink-0 pt-0.5">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">Confirm Deletion</p>
        <p className="mt-1 text-sm text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {user.first_name} {user.last_name}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-4 flex space-x-3">
          <button
            onClick={onConfirm}
            className="dropdown-toast-btn dropdown-toast-confirm px-3 py-1 text-xs font-medium rounded-md focus:outline-none bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="dropdown-toast-btn dropdown-toast-cancel px-3 py-1 text-xs font-medium rounded-md focus:outline-none bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function EllipsisDropdown({
  user,
  onEdit,
  users,
  setUsers,
  setFilteredUsers,
}: EllipsisDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle edit
  const handleEdit = useCallback(() => {
    onEdit(user);
    setIsOpen(false);
  }, [onEdit, user]);

  // Handle export to PDF
  const handleExport = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`User Details: ${user.first_name} ${user.last_name}`, 10, 10);
    doc.text(`Email: ${user.email}`, 10, 20);
    doc.text(`Role: ${user.role || "General Back Office"}`, 10, 30);
    doc.text(`Status: ${user.status || "Active"}`, 10, 40);
    doc.text(`Created On: ${formatDate(user.created_at, "short")}`, 10, 50);
    doc.save(`${user.first_name}_${user.last_name}_details.pdf`);
    toast.success(`Exported ${user.first_name} ${user.last_name}'s details.`, {
      duration: 3000,
      position: "top-right",
    });
    setIsOpen(false);
  }, [user]);

  // Handle delete with confirmation
  const handleDelete = useCallback(() => {
    toast.custom(
      (t) => (
        <ConfirmationToast
          user={user}
          onConfirm={async () => {
            toast.dismiss(t.id);
            try {
              await deleteUser(user.id);
              const updatedUsers = users.filter((u) => u.id !== user.id);
              setUsers(updatedUsers);
              setFilteredUsers(updatedUsers);
            
            storage.setLocalUsers(updatedUsers);
              dispatch(
                logUserAction({
                  actionType: "deleted",
                  user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                  },
                })
              );
              toast.success(
                `${user.first_name} ${user.last_name} has been deleted.`,
                {
                  duration: 2000,
                  icon: <Trash2 className="h-5 w-5 text-red-600" />,
                  position: "top-right",
                  style: {
                    background: "#fef2f2",
                    color: "#b91c1c",
                    border: "1px solid #fecaca",
                  },
                }
              );
            } catch (error) {
              toast.error(
                `Failed to delete user: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`,
                { duration: 2000, position: "top-right" }
              );
            }
            setIsOpen(false);
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      {
        duration: 4000,
        position: "top-center",
      }
    );
  }, [user, users, setUsers, setFilteredUsers, dispatch]);

  // Define menu actions dynamically
  const menuActions: MenuAction[] = useMemo(
    () => [
      {
        label: "View profile",
        icon: User,
        onClick: () => setIsOpen(false),
        isLink: true,
        href: `/users/${user.id}`,
      },
      {
        label: "Edit details",
        icon: Pencil,
        onClick: handleEdit,
      },
      {
        label: "Export details",
        icon: CloudDownload,
        onClick: handleExport,
      },
      {
        label: "Delete user",
        icon: Trash2,
        onClick: handleDelete,
        className: "dropdown-item-danger border-t border-gray-200 text-red-600 hover:bg-red-50",
      },
    ],
    [user.id, handleEdit, handleExport, handleDelete]
  );

  return (
    <div className="dropdown-container relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <EllipsisVertical size={20} />
      </button>
      {isOpen && (
        <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            {menuActions.map((action) => (
              <MenuItem key={action.label} {...action} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
