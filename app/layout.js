export const metadata = {
  title: "Chatem",
  description: "AI chat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
