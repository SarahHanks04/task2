import { useState, useEffect } from "react";
import { UserAction } from "@/types/dashboard";

export function useUserActions(limit: number = 5): UserAction[] {
  const [userActions, setUserActions] = useState<UserAction[]>([]);

  useEffect(() => {
    const fetchUserActions = () => {
      try {
        const actions = JSON.parse(
          localStorage.getItem("userActions") || "[]"
        ) as UserAction[];
        setUserActions(actions.slice(0, limit));
      } catch (error) {
        console.error("Failed to parse userActions:", error);
        setUserActions([]);
      }
    };

    fetchUserActions();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "userActions") {
        fetchUserActions();
      }
    };

    const handleCustomStorageUpdate = () => {
      fetchUserActions();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userActionLogged", handleCustomStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userActionLogged", handleCustomStorageUpdate);
    };
  }, [limit]);

  return userActions;
} 

// import { useState, useEffect } from "react";
// import { UserAction } from "@/types/dashboard";

// export function useUserActions(limit: number = 5): UserAction[] {
//   const [userActions, setUserActions] = useState<UserAction[]>([]);

//   const fetchUserActions = () => {
//     try {
//       const actions = JSON.parse(
//         localStorage.getItem("userActions") || "[]"
//       ) as UserAction[];
//       setUserActions(actions.slice(0, limit));
//     } catch (error) {
//       console.error("Failed to parse userActions:", error);
//       setUserActions([]);
//     }
//   };

//   useEffect(() => {
//     fetchUserActions();

//     const handleStorageChange = (event: StorageEvent) => {
//       if (event.key === "userActions") {
//         fetchUserActions();
//       }
//     };

//     const handleCustomStorageUpdate = () => {
//       fetchUserActions();
//     };

//     window.addEventListener("storage", handleStorageChange);
//     window.addEventListener("userActionLogged", handleCustomStorageUpdate);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       window.removeEventListener("userActionLogged", handleCustomStorageUpdate);
//     };
//   }, []);

//   return userActions;
// }
