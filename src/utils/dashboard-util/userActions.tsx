import { DashboardUser } from "@/types/dashboard";

interface ActionMeta {
  updatedFields?: string[];
}

export const logUserAction = (
  action: "added" | "updated" | "deleted",
  user: DashboardUser,
  meta?: ActionMeta
) => {
  const timestamp = new Date().toISOString();
  const log = {
    id: user.id,
    actionType: action,
    user: {
      first_name: user.first_name,
      last_name: user.last_name,
    },
    timestamp,
    ...(meta || {}),
  };
  console.log("User Action:", log);
  // Add to localStorage or API logging if needed
  const logs = JSON.parse(localStorage.getItem("userActions") || "[]");
  logs.push(log);
  localStorage.setItem("userActions", JSON.stringify(logs));
};
