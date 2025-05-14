"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-[#4a5e80] to-[#4a5e90] backdrop-blur-md p-4 shadow-lg z-10 transition-colors duration-500 ease-in-out hover:from-[#3f5579] hover:to-[#2e3e5c]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-[#e3c671] text-xl sm:text-2xl font-semibold flex items-center gap-1">
          <span>🍃</span> <span>Enchanted Recipes</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-4 items-center">
          <Link href="/predict-image" className="bg-[#9C6644] text-white px-4 py-2 rounded-md shadow hover:bg-[#7E4B30] transition-all">
            Predict from Image
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="cursor-pointer text-[#e3c671] hover:text-[#7E4B30] transition-all font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-[#e3c671] hover:text-[#7E4B30] transition-all font-medium">
                Login
              </Link>
              <Link href="/signup" className="text-[#e3c671] hover:text-[#7E4B30] transition-all font-medium">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Button (Mobile) */}
        <button
          className="md:hidden text-[#e3c671] focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 items-start px-4">
          <Link href="/predict-image" className="bg-[#9C6644] text-white w-full text-center py-2 rounded-md shadow hover:bg-[#7E4B30] transition-all">
            Predict from Image
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full text-left text-[#e3c671] hover:text-[#7E4B30] transition-all font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="w-full text-left text-[#e3c671] hover:text-[#7E4B30] transition-all font-medium">
                Login
              </Link>
              <Link href="/signup" className="w-full text-left text-[#e3c671] hover:text-[#7E4B30] transition-all font-medium">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
