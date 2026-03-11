import { useState, useCallback, useEffect, useRef } from "react";
import messageService from "../../api/messageService";

const POLL_INTERVAL = 10000; // 10 secondes

const useUnreadMessages = () => {
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchUnread = useCallback(async () => {
    try {
      const data = await messageService.getUnreadCounts();
      setUnreadCounts(data || {});
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (projetId) => {
    try {
      await messageService.markAsRead(projetId);
      setUnreadCounts((prev) => {
        const next = { ...prev };
        delete next[String(projetId)];
        return next;
      });
    } catch {
      // silencieux
    }
  }, []);

  useEffect(() => {
    fetchUnread();
    intervalRef.current = setInterval(fetchUnread, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchUnread]);

  return { unreadCounts, loading, markAsRead, refresh: fetchUnread };
};

export default useUnreadMessages;
