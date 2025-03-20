import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Spotify Tracker",
  description: "Spotify Data Visualization App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
          <body>
              <header>
                  <h1>Spotify Tracker</h1>
              </header>
              <main>{children}</main>
              <footer>
                  <p>© 2025 Spotify Tracker</p>
              </footer>
          </body>
      </html>
  );
}
