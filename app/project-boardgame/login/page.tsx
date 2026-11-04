"use client";

import Footer from "../components/footerB";
import Header from "../components/headerB";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ดึงชื่อก่อนเครื่องหมาย @ มาแสดงเป็นชื่อผู้ใช้คร่าวๆ (หรือเปลี่ยนเป็นข้อมูลอื่นได้)
    const displayName = email.split("@")[0];
    const userData = { email, name: displayName };

    // บันทึกข้อมูลผู้ใช้ลง localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // ย้ายไปหน้าหลัก
    router.push("/project-boardgame");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
        {/* หัวข้อ */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          เข้าสู่ระบบ
        </h2>

        {/* ฟอร์มกรอกข้อมูล */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2"
          >
            Login
          </button>
        </form>

        {/* ลิงก์ไปหน้าสมัครสมาชิก */}
        <div className="text-center mt-6 text-sm text-gray-600">
          ยังไม่มีบัญชี?{" "}
          <Link
            href="/project-boardgame/register"
            className="text-blue-600 hover:underline font-medium"
          >
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </div>
  );
}
