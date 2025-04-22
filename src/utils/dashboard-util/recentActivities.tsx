"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RecentActivityProps } from "@/types/dashboard";
import UserTableRow from "@/components/userTableRow";
import ActionItem from "@/components/actionItem";
import ChartCard from "@/components/chartCard";
import { containerVariants } from "../animations";
import { useUserActions } from "@/hooks/useUserActions";

interface SectionConfig {
  title: string;
  content: React.ReactNode;
  link: { href: string; text: string };
  delay: number;
}

export default function RecentActivity({ recentUsers }: RecentActivityProps) {
  const userActions = useUserActions(5);

  const sections: SectionConfig[] = [
    {
      title: "Recent Users",
      content: (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-[#11453B]/10">
                <th className="pb-3 font-medium sm:text-xs">Name</th>
                <th className="pb-3 font-medium sm:text-xs">Email</th>
                <th className="pb-3 font-medium sm:text-xs">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <UserTableRow key={user.id} user={user} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="py-3 text-sm text-gray-500 sm:text-xs"
                  >
                    No recent users available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ),
      link: { href: "/users", text: "View All →" },
      delay: 0,
    },
    {
      title: "User Actions",
      content:
        userActions.length > 0 ? (
          <div className="space-y-4">
            {userActions.map((action) => (
              <ActionItem key={action.id} action={action} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 sm:text-xs">
            No recent actions available.
          </p>
        ),
      link: { href: "/actions", text: "View All →" },
      delay: 0.1,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6"
    >
      {sections.map((section) => (
        <ChartCard
          key={section.title}
          title={section.title}
          delay={section.delay}
        >
          {section.content}
          <div className="flex justify-end mt-6">
            <Link
              href={section.link.href}
              className="text-sm text-[#11453B] hover:text-[#11453B]/70 transition-colors duration-200"
            >
              {section.link.text}
            </Link>
          </div>
        </ChartCard>
      ))}
    </motion.div>
  );
}
