"use client";

import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiKey.trim()) return;

    setIsLoading(true);

    try {
      console.log("küldés:", { input, apiKey });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="OpenAI API kulcs"
        className="w-full px-4 py-2 rounded-lg border"
      />

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Írj üzenetet..."
        className="w-full rounded-xl border px-4 py-3 min-h-[120px]"
      />

      <button
        type="submit"
        disabled={!input.trim() || !apiKey.trim() || isLoading}
        className="bg-black text-white rounded-lg py-2 disabled:opacity-50"
      >
        {isLoading ? "..." : "Küldés"}
      </button>
    </form>
  );
}
