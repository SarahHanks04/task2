"use client";

import { CircleCheck, Plus, UserRoundCheck } from "lucide-react";
import { SummaryCardsProps, SummaryCardConfig } from "@/types/dashboard";
import SummaryCard from "@/components/summaryCard";

export default function SummaryCards({
  totalUsers,
  newUsers,
  activeUsers,
}: SummaryCardsProps) {
  const cards: SummaryCardConfig[] = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: UserRoundCheck,
      borderColor: "border-[#4BC0C0]",
      progressWidth: () => "100%",
    },
    {
      title: "New Users (2 Days ago)",
      value: newUsers,
      icon: Plus,
      borderColor: "border-[#FF6384]",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: CircleCheck,
      borderColor: "border-[#36A2EB]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => (
        <SummaryCard
          key={card.title}
          {...card}
          totalUsers={totalUsers}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
