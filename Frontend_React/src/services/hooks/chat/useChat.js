import { useCallback, useEffect, useRef, useState } from "react";
import messageService from "../../api/messageService";

const POLL_INTERVAL = 5000; // 5 secondes

const useChat = (projetId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!projetId) return;
    try {
      const data = await messageService.getMessages(projetId);
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [projetId]);

  const sendMessage = useCallback(
    async (contenu) => {
      if (!projetId || !contenu.trim()) return;
      setSending(true);
      try {
        const newMsg = await messageService.sendMessage(projetId, contenu);
        setMessages((prev) => [...prev, newMsg]);
        return newMsg;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [projetId],
  );

  // Fetch initial + polling
  useEffect(() => {
    if (!projetId) return;
    setLoading(true);
    fetchMessages();

    intervalRef.current = setInterval(fetchMessages, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [projetId, fetchMessages]);

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refresh: fetchMessages,
  };
};

export default useChat;
