import { ChartOptions } from "chart.js";

export const pieChartOptions: ChartOptions<"pie"> = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        boxHeight: 6,
        padding: 12,
        font: { size: 12 },
      },
    },
  },
};

export const lineChartOptions: ChartOptions<"line"> = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#4A90E2" },
    },
    y: {
      beginAtZero: true,
      grid: { color: "#F0F7EB80" },
      ticks: {
        color: "#4A90E2",
        stepSize: 1,
      },
    },
  },
};
