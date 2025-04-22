"use client";

import { motion } from "framer-motion";
import { UserAction } from "@/types/dashboard";
import { itemVariants } from "@/utils/animations";

interface ActionItemProps {
  action: UserAction;
}

const actionStyles: Record<
  UserAction["actionType"],
  { bg: string; label: string }
> = {
  added: { bg: "bg-green-500", label: "A" },
  updated: { bg: "bg-blue-500", label: "U" },
  deleted: { bg: "bg-red-500", label: "D" },
};

export default function ActionItem({ action }: ActionItemProps) {
  const { bg, label } = actionStyles[action.actionType];
  const timestamp = new Date(action.timestamp);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="flex justify-between items-center p-4 rounded-lg hover:bg-[#F0F7EB80] transition-all duration-200"
    >
      <div className="flex items-center">
        <div
          className={`w-10 h-10 rounded-md flex items-center justify-center mr-4 sm:w-8 sm:h-8 ${bg}`}
        >
          <span className="text-white text-xs font-bold">{label}</span>
        </div>
        <div>
          <p className="font-medium text-[#11453B] sm:text-sm">
            {action.actionType === "added" &&
              `Added ${action.user.first_name} ${action.user.last_name}`}
            {action.actionType === "updated" &&
              `Updated ${action.user.first_name} ${action.user.last_name}`}
            {action.actionType === "deleted" &&
              `Deleted ${action.user.first_name} ${action.user.last_name}`}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-[#11453B] font-medium sm:text-xs">
          {timestamp.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="text-xs text-gray-500">
          {timestamp.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
}
