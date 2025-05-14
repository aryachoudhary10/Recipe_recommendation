import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./navbar";

export const metadata: Metadata = {
  title: "🍃 Enchanted Recipe Book",
  description: "Discover magical recipes inspired by Studio Ghibli worlds!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen flex flex-col text-[#5A4A42] font-[Poppins] relative"
        style={{
          backgroundImage: "url('/cropped-bgimage2.png')", // ✅ Correct path (put bgimage.png in /public)
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed", // Optional: makes background stay fixed when scrolling
        }}
      >
        {/* ✨ Animated Emoji Background */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-3xl animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              {["🍓", "🍋", "🥕", "🍅", "🍞", "🥦", "🍄", "🧄", "🧅", "🍇"][i % 10]}
            </span>
          ))}
        </div>

        {/* 🏷️ Navbar as client component */}
        <Navbar />

        {/* Main Content */}
        <main className="bg-pink/80 flex-grow w-full mx-auto p-8 rounded-xl shadow-md my-8 z-10 relative">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#4B3832] text-center p-4 text-[#F3EACB] text-sm mt-auto rounded-t-xl shadow-inner z-10">
          Crafted with love | © {new Date().getFullYear()} Enchanted Recipes
        </footer>
      </body>
    </html>
  );
}
