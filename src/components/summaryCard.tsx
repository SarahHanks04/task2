"use client";

import { motion } from "framer-motion";
import { SummaryCardConfig } from "@/types/dashboard";
import {
  cardVariants,
  statVariants,
  progressBarVariants,
} from "@/utils/animations";

interface SummaryCardProps extends SummaryCardConfig {
  totalUsers: number;
  delay?: number;
}

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  borderColor,
  progressColor = "#FFCE56",
  progressWidth = (value, total) =>
    `${Math.min((value / (total || 1)) * 100, 100)}%`,
  totalUsers,
  delay = 0,
}: SummaryCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ delay }}
      className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${borderColor} hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold text-gray-500">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-[#F0F7EB80] flex items-center justify-center">
          <span className="text-[#11453B]">
            <Icon size={15} />
          </span>
        </div>
      </div>
      <motion.p
        variants={statVariants}
        className="text-4xl font-bold text-[#11453B]"
      >
        {value}
      </motion.p>
      <div className="mt-4 h-1 bg-[#F0F7EB80] rounded-full overflow-hidden">
        <motion.div
          custom={progressWidth(value, totalUsers)}
          initial="hidden"
          animate="visible"
          variants={progressBarVariants}
          transition={{ delay: delay + 0.4 }}
          className={`h-full ${progressColor}`}
        />
      </div>
    </motion.div>
  );
}
