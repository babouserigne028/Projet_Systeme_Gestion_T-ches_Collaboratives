import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Ic } from "../../../../composants/Icons";
import Avatar from "../../../../composants/Avatar";
import useChat from "../../../../services/hooks/chat/useChat";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

const formatDateSeparator = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (d.toDateString() === yesterday.toDateString()) return "Hier";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const shouldShowDateSeparator = (messages, index) => {
  if (index === 0) return true;
  const prev = new Date(messages[index - 1].date_envoi).toDateString();
  const curr = new Date(messages[index].date_envoi).toDateString();
  return prev !== curr;
};

export default function ChatPanel({ projetId }) {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { messages, loading, sending, sendMessage } = useChat(projetId);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll en bas quand nouveaux messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    try {
      await sendMessage(text);
    } catch {}
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[420px]">
      {/* Messages area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-1 py-3 space-y-1"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Ic.MessageCircle className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400 font-medium">
              Aucun message pour le moment
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Commencez la discussion avec votre equipe
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = currentUser?.id === msg.auteur;
            const author = msg.auteur_details;
            const showDate = shouldShowDateSeparator(messages, i);

            return (
              <div key={msg.id}>
                {/* Date separator */}
                {showDate && (
                  <div className="flex items-center gap-2 my-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">
                      {formatDateSeparator(msg.date_envoi)}
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`flex gap-2 mb-1.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!isMe && (
                    <div className="shrink-0 mt-auto">
                      <Avatar
                        ini={`${author?.prenom?.[0] || ""}${author?.nom?.[0] || ""}`}
                        role={author?.role}
                        photo={author?.photo}
                        sm
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] ${isMe ? "items-end" : "items-start"}`}
                  >
                    {!isMe && (
                      <p className="text-[10px] font-semibold text-gray-500 mb-0.5 ml-1">
                        {author?.prenom} {author?.nom}
                      </p>
                    )}
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md border border-gray-200"
                      }`}
                    >
                      {msg.contenu}
                    </div>
                    <p
                      className={`text-[10px] text-gray-400 mt-0.5 ${isMe ? "text-right mr-1" : "ml-1"}`}
                    >
                      {formatTime(msg.date_envoi)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 pt-3 mt-auto">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ecrire un message..."
            rows={1}
            className="flex-1 resize-none text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 transition-colors max-h-24"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
          >
            <Ic.Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
