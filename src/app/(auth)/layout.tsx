// "use client";

// import { useSelector } from "react-redux";
// import { usePathname } from "next/navigation";
// import { RootState } from "@/redux/store";
// import Sidebar from "@/components/sidebar";
// import MainContent from "@/components/mainContent";

// interface AuthenticatedLayoutProps {
//   children: React.ReactNode;
// }

// export default function AuthenticatedLayout({
//   children,
// }: AuthenticatedLayoutProps) {
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const pathname = usePathname();

//   const publicRoutes = ["/login", "/register"];
//   const shouldShowSidebar = isAuthenticated && !publicRoutes.includes(pathname);

//   return (
//     <>
//       {shouldShowSidebar ? (
//         <div className="flex flex-col min-h-screen">
//           <div className="flex flex-1">
//             <Sidebar />
//             <MainContent>{children}</MainContent>
//           </div>
//         </div>
//       ) : (
//         <div className="w-full">{children}</div>
//       )}
//     </>
//   );
// }



"use client";

import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import MainContent from "@/components/mainContent";
import { AuthenticatedLayoutProps } from "@/types/authenticatedLayout";
import { PUBLIC_ROUTES } from "@/lib/constants";
import { RootState } from "@/redux/store";


export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
//   const { isAuthenticated } = useSelector((state: AuthState) => state);
const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const pathname = usePathname();

  const shouldShowSidebar = isAuthenticated && !PUBLIC_ROUTES.includes(pathname);

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