"use client";

import { useState } from "react";
import AddUserModal from "./add-users";
import { DashboardUser } from "@/types/dashboard";

interface AddUserButtonProps {
  onUserAdded: (user: DashboardUser) => void;
}

export default function AddUserButton({ onUserAdded }: AddUserButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="py-[6px] px-3 flex items-center cursor-pointer rounded-md shadow-md gap-2 hover:bg-[#F0F7EB] hover:text-[#11453B] bg-[#11453B]/80 text-white"
      >
        <span className="text-lg">+</span>
        <span className="text-xs">Add User</span>
      </button>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUserAdded={onUserAdded}
      />
    </>
  );
}
