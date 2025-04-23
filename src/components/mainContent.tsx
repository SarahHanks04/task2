"use client";

import { useSelector } from "react-redux";
import { selectIsCollapsed } from "../redux/slices/sidebarSlice";

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const isCollapsed = useSelector(selectIsCollapsed);

  return (
    <main
      className={`flex-1 w-full transition-all duration-300 ${
        isCollapsed ? "md:pl-14" : "md:pl-56"
      } pt-16 md:pt-0`}
    >
      {children}
    </main>
  );
}
