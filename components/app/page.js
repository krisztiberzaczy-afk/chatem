import Chat from "../components/chat";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <Chat />
      </div>
    </main>
  );
}
