"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { containerVariants } from "@/utils/animations";
import { useUserActions } from "@/hooks/useUserActions";
import ActionItem from "@/components/actionItem";

export default function UserActionsPage() {
  const userActions = useUserActions();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#11453B]">
            All User Actions
          </h1>
          <Link
            href="/dashboard"
            className="text-sm text-[#11453B] hover:text-[#11453B]/70 transition-colors duration-200"
            aria-label="Back to Dashboard"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <motion.div className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10">
          <div className="space-y-4">
            {userActions.length > 0 ? (
              userActions.map((action) => (
                <ActionItem key={action.id} action={action} />
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No user actions available.
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
