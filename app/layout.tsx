import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Irish Language Journal",
  description: "Learn Irish with spaced repetition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ga" className="h-full">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <nav className="bg-emerald-800 text-white shadow-md">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight hover:text-emerald-200 transition-colors">
              🇮🇪 Irish Journal
            </Link>
            <div className="flex gap-4 text-sm font-medium">
              <Link href="/" className="hover:text-emerald-200 transition-colors">Dashboard</Link>
              <Link href="/words" className="hover:text-emerald-200 transition-colors">Words</Link>
              <Link href="/add" className="hover:text-emerald-200 transition-colors">Add Word</Link>
              <Link href="/quiz" className="hover:text-emerald-200 transition-colors">Quiz</Link>
            </div>
          </div>
        </nav>
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="text-center text-xs text-stone-400 py-4 border-t border-stone-200">
          Foghlaim Gaeilge — Learn Irish
        </footer>
      </body>
    </html>
  );
}
