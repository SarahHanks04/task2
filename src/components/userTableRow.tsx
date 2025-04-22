"use client";

import { motion } from "framer-motion";
import { DashboardUser } from "@/types/dashboard";
import { itemVariants } from "@/utils/animations";

interface UserTableRowProps {
  user: DashboardUser;
}

export default function UserTableRow({ user }: UserTableRowProps) {
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Apr 8, 2025";

  return (
    <motion.tr
      variants={itemVariants}
      whileHover={{ backgroundColor: "#F0F7EB80" }}
      className="border-b border-[#11453B]/10 last:border-0"
    >
      <td className="py-3 pr-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#F0F7EB]/80 flex items-center justify-center mr-3 sm:w-8 sm:h-8">
            <span className="text-sm font-bold text-[#11453B] sm:text-xs">
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </span>
          </div>
          <span className="font-medium text-[#11453B] sm:text-sm">
            {`${user.first_name} ${user.last_name}`}
          </span>
        </div>
      </td>
      <td className="py-3 pr-4 text-sm text-gray-600 sm:text-xs">
        {user.email}
      </td>
      <td className="py-3 text-sm text-gray-500 sm:text-xs">{createdAt}</td>
    </motion.tr>
  );
}
