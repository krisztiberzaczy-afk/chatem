"use client";

import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !apiKey.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input,
          apiKey
        })
      });

      const data = await res.json();

      if (data.output) {
        setResponse(data.output);
      } else {
        setResponse("Hiba történt a válasz során.");
      }

      setInput("");
    } catch (err) {
      setResponse("Hiba történt a kérés során.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {isLoading ? "Küldés..." : "Küldés"}
        </button>
      </form>

      {response && (
        <div className="p-4 border rounded-lg bg-gray-50">
          {response}
        </div>
      )}
    </div>
  );
}
