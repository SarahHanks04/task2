import { useState, useEffect } from "react";

export const useLastSeen = (): Date | null => {
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    const lastSeenTime = localStorage.getItem("lastSeen");
    if (lastSeenTime) {
      setLastSeen(new Date(lastSeenTime));
    }

    const now = new Date();
    localStorage.setItem("lastSeen", now.toISOString());
  }, []);

  return lastSeen;
};
