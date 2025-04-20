"use client";

import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { RootState } from "@/redux/store";
import Sidebar from "@/components/sidebar";
import MainContent from "@/components/mainContent";

// Props interface
interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();

  const publicRoutes = ["/login", "/register"];
  const shouldShowSidebar = isAuthenticated && !publicRoutes.includes(pathname);

  return (
    <>
      {shouldShowSidebar ? (
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-1">
            <Sidebar />
            <MainContent>{children}</MainContent>
          </div>
        </div>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </>
  );
}
