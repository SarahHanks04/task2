"use client";

import { motion } from "framer-motion";
import { StatusData } from "@/types/dashboard";
import { progressBarVariants } from "@/utils/animations";

interface StatusBreakdownProps {
  statusData: StatusData[];
}

export default function StatusBreakdown({ statusData }: StatusBreakdownProps) {
  return (
    <div className="space-y-4">
      {statusData.map((item, index) => (
        <div key={item.label} className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-[#11453B]">{item.label}</span>
            <span className="text-sm font-medium text-[#11453B]">
              {item.value}%
            </span>
          </div>
          <div className="w-full h-[6px] bg-[#F0F7EB80] rounded-full overflow-hidden">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={`${item.value}%`}
              variants={progressBarVariants}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
