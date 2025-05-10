"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>🍃 Enchanted Recipe Book</title>
        <meta name="description" content="Discover magical recipes inspired by Studio Ghibli worlds!" />
      </head>
      <body
        className="min-h-screen flex flex-col text-[#5A4A42] font-serif"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* 🍂 Navigation Bar */}
        <nav className="bg-gradient-to-r from-[#FFF5F5] to-[#D72638] p-4 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-white text-3xl font-[Cursive] flex items-center">
              🍃 <span className="ml-2">Enchanted Recipes</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex gap-6">
              <Link href="/predict-image" className="bg-white text-[#9C6644] px-4 py-2 rounded-lg shadow hover:bg-[#F4E1D2] transition-all flex items-center">
                📸 Predict from Image
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-200 transition-all"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login" className="text-white hover:text-gray-200 transition-all">
                    Login
                  </Link>
                  <Link href="/signup" className="text-white hover:text-gray-200 transition-all">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* 📜 Main Content with Soft Overlay */}
        <main className="flex-grow w-full max-w-6xl mx-auto p-6">
          {children}
        </main>

        {/* 🍵 Footer */}
        <footer className="bg-[#5A4A42] text-center p-4 text-[#F3EACB] text-sm mt-auto">
          🍵 Crafted with love | © {new Date().getFullYear()} Enchanted Recipes
        </footer>
      </body>
    </html>
  );
}
