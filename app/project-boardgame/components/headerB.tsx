"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserType {
  email: string;
  name?: string;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        const parsedUser = JSON.parse(storedUser) as UserType;
        if (
          parsedUser &&
          typeof parsedUser === "object" &&
          "email" in parsedUser
        ) {
          setTimeout(() => setUser(parsedUser), 0);
        }
      }
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    setUser(null);
    setIsOpen(false);
    router.push("/project-boardgame/login");
  };

  // Seach Bar เมื่อกด Enter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(
        `/project-boardgame?search=${encodeURIComponent(searchTerm.trim())}`,
      );
    } else {
      router.push("/project-boardgame");
    }
  };

  // แถบ bar ด้านบน
  const handleCategoryClick = (category: string) => {
    if (category === "ทั้งหมด") {
      router.push("/project-boardgame");
    } else {
      router.push(
        `/project-boardgame?category=${encodeURIComponent(category)}`,
      );
    }
  };

  return (
    <header className="bg-blue-300 text-white shadow-md fixed w-full top-0 left-0 z-50">
      {/* แถบ header */}
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center gap-4">
        {/* โลโก้ */}
        <Link
          href="/project-boardgame"
          className="text-2xl font-bold text-white flex items-center gap-2 shrink-0"
        >
          <div className="bg-white text-blue-300 p-1.5 rounded-full flex items-center justify-center shadow-sm">
            🪅
          </div>
          <span className="hidden sm:inline font-extrabold tracking-wide">
            Boardgame
          </span>
        </Link>

        {/* Search Bar ครอบด้วย <form> เพื่อให้กด Enter ได้ */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาบอร์ดเกม, ประเภท..."
              className="w-full bg-white text-gray-800 text-sm rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors p-1"
            >
              🔍
            </button>
          </div>
        </form>

        {/* ปุ่ม hamburger และ login,user */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <Link
              href="/project-boardgame/profile"
              className="font-medium text-sm bg-blue-500 hover:bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white-500 transition-colors"
            >
              {user.name || user.email}
            </Link>
          ) : (
            <Link
              href="/project-boardgame/login"
              className="bg-white text-blue-500 font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-orange-100 transition-colors shadow-sm"
            >
              เข้าสู่ระบบ
            </Link>
          )}

          {/* ปุ่ม Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-orange-700 focus:outline-none transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* แถบ bar ด้านล่างโลโก้ */}
      <div className="bg-blue-500 text-xs md:text-sm py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-start gap-6 font-medium text-white overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => handleCategoryClick("ทั้งหมด")}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            บอร์ดเกมทั้งหมด
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick("วางแผน (Strategy)")}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            หมวดเกมวางแผน
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick("ปาร์ตี้ (Party)")}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            หมวดเกมปาร์ตี้
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick("การ์ดเกม (Card Game)")}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            หมวดการ์ดเกม
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-64 bg-white text-gray-800 shadow-2xl z-50 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="font-bold text-lg text-blue-600">เมนูหลัก</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-500 font-bold p-1"
              >
                ✕
              </button>
            </div>
            <Link
              href="/project-boardgame/profile"
              className="py-2 px-3 hover:bg-orange-50 rounded-lg text-gray-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              ข้อมูลส่วนตัว
            </Link>
            <Link
              href="/project-boardgame/history"
              className="py-2 px-3 hover:bg-orange-50 rounded-lg text-gray-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              ประวัติการยืม
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="text-red-700 py-2 px-3 hover:bg-red-50 rounded-lg text-left font-medium mt-auto"
              >
                ออกจากระบบ
              </button>
            ) : (
              <Link
                href="/project-boardgame/login"
                className="text-blue-600 py-2 px-3 hover:bg-orange-50 rounded-lg font-medium mt-auto"
                onClick={() => setIsOpen(false)}
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </>
      )}
    </header>
  );
}
