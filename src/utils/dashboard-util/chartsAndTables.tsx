"use client";

import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import { motion } from "framer-motion";
import { ChartsAndTablesProps, UserActivity } from "@/types/dashboard";
import ChartCard from "@/components/chartCard";
import StatusBreakdown from "@/components/statusBreakdown";
import { containerVariants } from "../animations";
import { lineChartOptions, pieChartOptions } from "../chartConfigs";
import { getStatusData, getUserActivity } from "./helpers";
import { useMemo } from "react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

export default function ChartsAndTables({
  roleData,
  users,
}: ChartsAndTablesProps) {
  const userActivity = useMemo(() => getUserActivity(users), [users]);
  const statusData = useMemo(() => getStatusData(users), [users]);

  // Line chart data
  const lineData = {
    labels: userActivity.map((item) => item.month),
    datasets: [
      {
        label: "Users Created",
        data: userActivity.map((item) => item.count),
        fill: false,
        borderColor: "#FF6B6B",
        backgroundColor: "#11453B",
        borderWidth: 1,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  };

  // Chart configurations
  const charts = [
    {
      title: "Role Distribution",
      content: <Pie data={roleData} options={pieChartOptions} />,
      delay: 0,
    },
    {
      title: "User Activity Trends",
      content: userActivity.some((item: UserActivity) => item.count > 0) ? (
        <Line data={lineData} options={lineChartOptions} />
      ) : (
        <p className="text-sm text-gray-500">
          No user activity data available.
        </p>
      ),
      delay: 0.1,
    },
    {
      title: "Status Breakdown",
      content: <StatusBreakdown statusData={statusData} />,
      delay: 0.2,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
    >
      {charts.map((chart) => (
        <ChartCard key={chart.title} title={chart.title} delay={chart.delay}>
          {chart.content}
        </ChartCard>
      ))}
    </motion.div>
  );
}
