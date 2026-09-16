import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import useAuth from "../../../auth/hooks/useAuth.js";
import useChat from "../../hooks/useChat.js";
import "highlight.js/styles/github-dark.css";

const ChatHome = () => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const {
    messages = [],
    isSending,
    error,
    clearError,
    send,
    selectedConversationId,
  } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim() || isSending) {
      return;
    }

    clearError();
    const messageToSend = message;
    setMessage("");
    await send(messageToSend);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#171717] text-zinc-100">
      {!hasMessages ? (
        <div className="mx-auto mt-28 w-full max-w-4xl px-4 text-center md:mt-36">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-100 md:text-5xl">
            What&apos;s on your mind today?
          </h2>
          {user?.email ? (
            <p className="mt-3 text-sm text-zinc-400">
              Signed in as{" "}
              <span className="text-zinc-200 font-medium">{user.email}</span>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-4xl flex-1 min-h-0 flex-col px-4 pb-32 pt-4">
        {hasMessages ? (
          <div className="chat-scrollbar flex-1 space-y-6 overflow-y-auto pr-2">
            {messages.map((chatMessage) => (
              <div key={chatMessage.id} className="w-full">
                {chatMessage.author === "user" ? (
                  <div className="ml-auto w-fit max-w-2xl rounded-3xl bg-[#2f2f2f] px-5 py-3 text-[15px] leading-relaxed text-zinc-100 shadow-sm">
                    {chatMessage.content}
                  </div>
                ) : (
                  <div className="flex items-start gap-4 max-w-3xl">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm">
                      AI
                    </div>
                    <div className="markdown-content min-w-0 flex-1 text-[15px] leading-7 text-zinc-200">
                      {chatMessage.content ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {chatMessage.content}
                        </ReactMarkdown>
                      ) : isSending ? (
                        <div
                          className="flex items-center gap-1.5 py-2"
                          aria-label="Thinking"
                        >
                          <span className="thinking-dot" />
                          <span className="thinking-dot" />
                          <span className="thinking-dot" />
                        </div>
                      ) : (
                        <span className="text-sm italic text-zinc-500">
                          No response generated
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#171717] via-[#171717]/95 to-transparent pb-6 pt-14">
        <div className="pointer-events-auto mx-auto w-full max-w-4xl px-4">
          {error ? (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-sm text-rose-300 backdrop-blur-md shadow-lg">
              <span>⚠️ {error}</span>
              <button
                type="button"
                onClick={clearError}
                className="ml-3 text-xs font-semibold text-rose-400 hover:text-rose-200 underline"
              >
                Dismiss
              </button>
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 rounded-[30px] border border-white/10 bg-[#212121] px-4 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition focus-within:border-white/20"
          >
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-zinc-200"
              aria-label="Add attachment"
            >
              +
            </button>

            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask anything"
              className="h-10 flex-1 bg-transparent text-[16px] text-zinc-100 outline-none placeholder:text-zinc-500"
              disabled={isSending}
            />

            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="rounded-full bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </form>

          <div className="mt-2 px-2 text-center text-xs text-zinc-500">
            {selectedConversationId
              ? `Conversation ID: ${selectedConversationId}`
              : "ChatGPT clone can make mistakes. Check important info."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHome;
