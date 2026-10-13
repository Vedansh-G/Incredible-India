import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiArrowLeft, FiMessageCircle } from "react-icons/fi";
import Layout from "../components/Layout";

function AIChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  
  const params = useParams();
console.log(params);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tourists/${id}`).then((res) => {
      setMessages([
        {
          sender: "bot",
          text: `Hello! Ask me anything about ${res.data.name}.`,
        },
      ]);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = question;

    setQuestion("");
    setSending(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        question: currentQuestion,
        touristId: id,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.answer,
        },
      ]);
    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const suggestions = [
    "Best time to visit?",
    "How do I get there?",
    "What should I carry?",
    "Nearby attractions?",
  ];

  return (
    <Layout className="flex flex-col">
      <div className="mx-auto flex h-[calc(100vh-4.5rem)] w-full max-w-4xl flex-col px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 border-b border-ink-100 dark:border-ink-800 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 dark:border-ink-700 text-ink-500 hover:text-brand-600"
            >
              <FiArrowLeft />
            </button>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                <FiMessageCircle />
              </span>
              <div>
                <h1 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
                  Wanderly AI
                </h1>
                <p className="text-xs text-ink-500">Your travel companion</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={`${index}-${msg.text.slice(0, 12)}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`mb-4 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-soft sm:max-w-[70%] ${
                    msg.sender === "user"
                      ? "rounded-br-md bg-brand-600 text-white"
                      : "rounded-bl-md glass text-ink-800 dark:text-ink-100"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sending && (
            <div className="mb-4 flex justify-start">
              <div className="glass rounded-2xl rounded-bl-md px-5 py-3 text-sm text-ink-500">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}

          {messages.length <= 1 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuestion(s)}
                  className="rounded-xl border border-ink-200 dark:border-ink-700 bg-white/60 dark:bg-ink-900/60 px-3 py-2 text-xs font-medium text-ink-600 dark:text-ink-300 transition hover:border-brand-400 hover:text-brand-700"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-0 border-t border-ink-100 dark:border-ink-800 bg-sand-50/90 dark:bg-ink-950/90 py-4 backdrop-blur">
          <div className="flex items-end gap-3 rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2 shadow-soft">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask about tourist places..."
              className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-ink-900 dark:text-ink-50 outline-none placeholder:text-ink-400"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={sending || !question.trim()}
              className="btn-primary !rounded-xl !px-4 !py-3"
            >
              <FiSend />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-ink-400">
            Press Enter to send · Shift+Enter for a new line
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default AIChatPage;
