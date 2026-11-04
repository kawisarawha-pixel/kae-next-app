"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// นำเข้า Firebase (ปรับ path ให้ตรงกับที่เก็บไฟล์ firebase.tsx ของคุณ)
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    member_name: "",
    member_gmail: "",
    member_phone: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ฟังก์ชันคำนวณ member_id ถัดไป (M001, M002...) ทำงานเงียบๆ ในเบื้องหลัง
  const generateNextMemberId = async () => {
    try {
      const membersRef = collection(db, "boardgame", "member", "members_list");
      const q = query(membersRef, orderBy("member_id", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return "M001";
      } else {
        const lastMemberId = querySnapshot.docs[0].data().member_id || "M000";
        const currentNum = parseInt(lastMemberId.replace("M", ""), 10) || 0;
        const nextNum = currentNum + 1;
        return `M${String(nextNum).padStart(3, "0")}`;
      }
    } catch (error) {
      console.error("Error generating member ID:", error);
      return "M001";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // เจนรหัส member_id อัตโนมัติเมื่อกดปุ่มสมัคร
      const autoMemberId = await generateNextMemberId();

      await addDoc(collection(db, "boardgame", "member", "members_list"), {
        member_id: autoMemberId,
        member_name: formData.member_name,
        member_gmail: formData.member_gmail,
        member_phone: formData.member_phone,
        createdAt: new Date(),
      });

      alert("สมัครสมาชิกสำเร็จ!");
      router.push("/project-boardgame/login");
    } catch (error) {
      console.error("Error adding member: ", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 border border-orange-100">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          สมัครสมาชิก
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ชื่อ-นามสกุล */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              name="member_name"
              value={formData.member_name}
              onChange={handleChange}
              placeholder="กรอกชื่อ-นามสกุล"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* อีเมล */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล (Gmail)
            </label>
            <input
              type="email"
              name="member_gmail"
              value={formData.member_gmail}
              onChange={handleChange}
              placeholder="example@gmail.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* เบอร์โทรศัพท์ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              name="member_phone"
              value={formData.member_phone}
              onChange={handleChange}
              placeholder="08X-XXX-XXXX"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-4 disabled:bg-gray-400"
          >
            {loading ? "กำลังบันทึกข้อมูล..." : "สมัครสมาชิก"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href="/project-boardgame/login"
            className="text-blue-600 hover:underline font-medium"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}
