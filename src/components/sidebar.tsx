"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { logout } from "../redux/slices/authSlice";
import {
  toggleCollapse,
  setMobileMenu,
  selectIsCollapsed,
  selectIsMobileMenuOpen,
} from "../redux/slices/sidebarSlice";
import {
  LayoutDashboard,
  User,
  Users,
  Menu,
  X,
  ChevronsDown,
  Power,
} from "lucide-react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isCollapsed = useSelector(selectIsCollapsed);
  const isMobileMenuOpen = useSelector(selectIsMobileMenuOpen);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        dispatch(setMobileMenu(false));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout({ reason: "User initiated logout" }));
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    dispatch(toggleCollapse());
  };

  const isActive = (href: string) => pathname === href;

  const handleLinkClick = () => {
    if (isMobile) {
      dispatch(setMobileMenu(false));
    }
  };

  const renderLink = (
    href: string,
    Icon: React.ComponentType<{ size: number }>,
    label: string
  ) => {
    return (
      <Link href={href} onClick={handleLinkClick}>
        <div
          className={`flex items-center p-3 mb-2 hover:bg-[#F0F7EB80] hover:text-[#11453B] ${
            isActive(href)
              ? "bg-[#F0F7EB80] border-l-[5px] border-red-700 rounded-sm text-[#11453B] font-medium"
              : ""
          }`}
        >
          <span className="mr-2">
            <Icon size={20} />
          </span>
          {(!isCollapsed || isMobile) && label}
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#11453B] text-white flex items-center justify-between px-4 z-50 shadow-md">
          <div className="h-14 w-24 relative">
            <Image
              src="/images/icare.png"
              alt="ICare Logo"
              fill
              className="object-contain"
            />
          </div>
          <button
            onClick={() => dispatch(setMobileMenu(!isMobileMenuOpen))}
            className="p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={34} />}
          </button>
        </header>
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-[#11453B] text-white shadow-md transition-all duration-300 z-40 ${
          isMobile
            ? isMobileMenuOpen
              ? "w-56 translate-x-0"
              : "w-0 -translate-x-full"
            : isCollapsed
            ? "w-14"
            : "w-56"
        } ${isMobile ? "pt-16" : ""}`}
      >
        {/* Logo Section */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {!isCollapsed && !isMobile && (
            <Image
              src="/images/icare.png"
              alt="ICare Logo"
              width={isCollapsed ? 40 : 100}
              height={isCollapsed ? 40 : 40}
              className="transition-all duration-300"
            />
          )}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-[#F0F7EB80] rounded text-white"
            >
              {isCollapsed ? <Menu size={20} /> : <ChevronsDown size={24} />}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
          {/* Top Links */}
          <div>
            {renderLink("/", LayoutDashboard, "Dashboard")}
            {renderLink("/users", Users, "Users")}
            {renderLink("/profile", User, "My Profile")}
          </div>

          {/* Bottom Links (Logout) */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center p-3 hover:bg-[#F0F7EB80] hover:text-[#11453B] w-full text-left mb-[8rem] text-white"
            >
              <span className="mr-2">
                <Power size={20} />
              </span>
              {(!isCollapsed || isMobile) && "Logout"}
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay for Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => dispatch(setMobileMenu(false))}
        />
      )}
    </>
  );
};

export default Sidebar;
