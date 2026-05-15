import "./globals.css";

export const metadata = {
  title: "Calisthenics Rank Tracker",
  description: "Track your calisthenics progress with rank tiers."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
