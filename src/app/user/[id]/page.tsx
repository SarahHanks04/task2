// "use client";

// import { useSelector, useDispatch } from "react-redux";
// import { useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import {
//   ArrowLeft,
//   Mail,
//   Briefcase,
//   CheckCircle2,
//   CalendarDays,
// } from "lucide-react";
// import {
//   fetchUserById,
//   selectSelectedUser,
//   selectUsersLoading,
//   selectUsersError,
// } from "@/redux/slices/userSlice";
// import { AppDispatch } from "@/redux/store";
// import { DashboardUser, UserProps } from "@/types/dashboard";
// import Loading from "@/app/loading";
// import { formatDate } from "@/utils/dashboard-util/helpers";
// import { cardVariants, containerVariants, itemVariants } from "@/utils/animations";
// import UserDetailCard from "@/components/userDetailCard";

// interface DetailConfig {
//   label: string;
//   value: (user: DashboardUser) => string | JSX.Element;
//   icon: typeof Mail | typeof Briefcase | typeof CheckCircle2 | typeof CalendarDays;
// }

// export default function User({ params }: UserProps) {
//   const dispatch = useDispatch<AppDispatch>();
//   const selectedUser = useSelector(selectSelectedUser);
//   const loading = useSelector(selectUsersLoading);
//   const error = useSelector(selectUsersError);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { id } = await params;
//       dispatch(fetchUserById(id));
//     };
//     fetchUser();
//   }, [params, dispatch]);

//   if (loading)
//     return (
//       <div className="text-center py-20 text-[#11453B]">
//         <Loading />
//       </div>
//     );
//   if (error)
//     return <div className="text-red-500 text-center py-20">Error: {error}</div>;
//   if (!selectedUser)
//     return (
//       <div className="text-center py-20 text-[#11453B]">User not found</div>
//     );

//   const details: DetailConfig[] = [
//     {
//       label: "Email",
//       value: (user) => user.email || "Email not available",
//       icon: Mail,
//     },
//     {
//       label: "Role",
//       value: (user) => user.role || "General Back Office",
//       icon: Briefcase,
//     },
//     {
//       label: "Status",
//       value: (user) => (
//         <span
//           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//             (user.status || "Active") === "Active"
//               ? "bg-yellow-100 text-yellow-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {user.status || "Active"}
//         </span>
//       ),
//       icon: CheckCircle2,
//     },
//     {
//       label: "Created On",
//       value: (user) => formatDate(user.created_at, "long"),
//       icon: CalendarDays,
//     },
//   ];

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="p-6 bg-[#F0F7EB] min-h-screen"
//     >
//       <div className="max-w-4xl mx-auto">
//         <Link
//           href="/dashboard"
//           className="inline-flex items-center text-xs text-[#11453B] hover:text-[#0d3a2f] transition-colors mb-6 group"
//         >
//           <ArrowLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
//           Back to Dashboard
//         </Link>

//         <motion.div
//           variants={cardVariants}
//           className="bg-white rounded-2xl shadow-lg overflow-hidden"
//         >
//           {/* Header */}
//           <div className="bg-[#11453B] p-4 text-white">
//             <h1 className="text-2xl font-bold text-center">User Information</h1>
//           </div>

//           <div className="p-8">
//             {/* Profile picture */}
//             <motion.div variants={itemVariants} className="flex justify-center mb-8">
//               <div className="relative">
//                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#F0F7EB] shadow-md">
//                   <Image
//                     src={selectedUser.avatar || "/images/default-avatar.png"}
//                     alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
//                     width={128}
//                     height={128}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="absolute -bottom-3 -right-3 bg-[#11453B] text-white rounded-full p-2 shadow-lg">
//                   <CheckCircle2 className="h-6 w-6" />
//                 </div>
//               </div>
//             </motion.div>

//             {/* User name */}
//             <motion.div variants={itemVariants} className="text-center mb-8">
//               <h2 className="text-2xl font-bold text-[#11453B] inline-block pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#E2A03F] after:rounded-full">
//                 {selectedUser.first_name} {selectedUser.last_name}
//               </h2>
//             </motion.div>

//             {/* User details */}
//             <motion.div
//               variants={containerVariants}
//               className="grid grid-cols-1 md:grid-cols-2 gap-6"
//             >
//               {details.map((detail) => (
//                 <UserDetailCard
//                   key={detail.label}
//                   label={detail.label}
//                   value={detail.value(selectedUser)}
//                   icon={detail.icon}
//                 />
//               ))}
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }

"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Briefcase,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import {
  selectSelectedUser,
  selectUsersLoading,
  selectUsersError,
} from "@/redux/selectors/userSelectors";
import { AppDispatch } from "@/redux/store";
import { DashboardUser, UserProps } from "@/types/dashboard";
import Loading from "@/app/loading";
import { formatDate } from "@/utils/dashboard-util/helpers";
import {
  cardVariants,
  containerVariants,
  itemVariants,
} from "@/utils/animations";
import UserDetailCard from "@/components/userDetailCard";
import { fetchUserById } from "@/redux/slices/userSlice";

interface DetailConfig {
  label: string;
  value: (user: DashboardUser) => string | React.ReactNode;
  icon:
    | typeof Mail
    | typeof Briefcase
    | typeof CheckCircle2
    | typeof CalendarDays;
}

export default function User({ params }: UserProps) {
  const dispatch = useDispatch<AppDispatch>();
  const selectedUser = useSelector(selectSelectedUser);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    const fetchUser = async () => {
      const { id } = await params;
      dispatch(fetchUserById(id));
    };
    fetchUser();
  }, [params, dispatch]);

  if (loading)
    return (
      <div className="text-center py-20 text-[#11453B]">
        <Loading />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center py-20">Error: {error}</div>;
  if (!selectedUser)
    return (
      <div className="text-center py-20 text-[#11453B]">User not found</div>
    );

  const details: DetailConfig[] = [
    {
      label: "Email",
      value: (user) => user.email || "Email not available",
      icon: Mail,
    },
    {
      label: "Role",
      value: (user) => user.role || "General Back Office",
      icon: Briefcase,
    },
    {
      label: "Status",
      value: (user) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            (user.status || "Active") === "Active"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.status || "Active"}
        </span>
      ),
      icon: CheckCircle2,
    },
    {
      label: "Created On",
      value: (user) => formatDate(user.created_at, "long"),
      icon: CalendarDays,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 bg-[#F0F7EB] min-h-screen"
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs text-[#11453B] hover:text-[#0d3a2f] transition-colors mb-6 group"
        >
          <ArrowLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#11453B] p-4 text-white">
            <h1 className="text-2xl font-bold text-center">User Information</h1>
          </div>

          <div className="p-8">
            {/* Profile picture */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#F0F7EB] shadow-md">
                  <Image
                    src={selectedUser.avatar || "/images/default-avatar.jpg"}
                    alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-[#11453B] text-white rounded-full p-2 shadow-lg">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            {/* User name */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#11453B] inline-block pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#E2A03F] after:rounded-full">
                {selectedUser.first_name} {selectedUser.last_name}
              </h2>
            </motion.div>

            {/* User details */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {details.map((detail) => (
                <UserDetailCard
                  key={detail.label}
                  label={detail.label}
                  value={detail.value(selectedUser)}
                  icon={detail.icon}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
