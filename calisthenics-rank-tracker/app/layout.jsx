import "./globals.css";

export const metadata = {
  title: "Grind Rank Tracker",
  description: "A clean calisthenics rank tracker for Vercel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
