"use client";

import { itemVariants } from "@/utils/animations";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface UserDetailCardProps {
  label: string;
  value: string | React.ReactNode;
  icon: LucideIcon;
}

export default function UserDetailCard({ label, value, icon: Icon }: UserDetailCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#F0F7EB80] p-4 rounded-lg"
    >
      <div className="flex items-center mb-3">
        <Icon className="h-5 w-5 text-[#11453B] mr-2" />
        <span className="font-medium text-[#11453B]">{label}</span>
      </div>
      <div className="text-gray-700 pl-7">{value}</div>
    </motion.div>
  );
}