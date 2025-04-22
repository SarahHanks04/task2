"use client";

import { cardVariants } from "@/utils/animations";
import { motion } from "framer-motion";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export default function ChartCard({
  title,
  children,
  delay = 0,
}: ChartCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      transition={{ delay }}
      className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10 hover:shadow-md transition-all duration-300"
    >
      <h3 className="text-xl font-semibold text-[#11453B] mb-6">{title}</h3>
      <div className="w-full h-64">{children}</div>
    </motion.div>
  );
}
