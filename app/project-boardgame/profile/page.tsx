"use client";

import { useState, useEffect } from "react";
import Header from "../components/headerB";
import Footer from "../components/footerB";
import Link from "next/link";

// นำเข้า Firebase
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

interface UserData {
  docId?: string;
  member_name: string;
  member_gmail: string;
  member_phone: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData>({
    member_name: "",
    member_gmail: "",
    member_phone: "",
  });

  const [initialData, setInitialData] = useState<UserData>({
    member_name: "",
    member_gmail: "",
    member_phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ดึงข้อมูลผู้ใช้จาก localStorage และ Firestore เมื่อเปิดหน้าเว็บ
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(storedUser);
        const userEmail = parsed.email || "";

        // ค้นหาข้อมูลผู้ใช้ใน Firestore ตาม email
        const membersRef = collection(
          db,
          "boardgame",
          "member",
          "members_list",
        );
        const q = query(membersRef, where("member_gmail", "==", userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const data = userDoc.data() as UserData;
          const loadedData: UserData = {
            docId: userDoc.id,
            member_name: data.member_name || parsed.name || "",
            member_gmail: data.member_gmail || userEmail,
            member_phone: data.member_phone || parsed.phone || "",
          };
          setUserData(loadedData);
          setInitialData(loadedData);
        } else {
          // ถ้าไม่มีใน Firestore ให้ดึงข้อมูลเริ่มต้นจาก localStorage
          const fallbackData: UserData = {
            member_gmail: userEmail,
            member_name: parsed.name || "",
            member_phone: parsed.phone || "",
          };
          setUserData(fallbackData);
          setInitialData(fallbackData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchUserProfile();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ปุ่ม ยกเลิก -> คืนค่าเดิมก่อนแก้ไข
  const handleCancel = () => {
    setUserData(initialData);
  };

  // การบันทึกข้อมูลส่วนตัวใหม่
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (userData.docId) {
        // อัปเดตข้อมูลใน Firestore (รวมถึง member_gmail)
        const userRef = doc(
          db,
          "boardgame",
          "member",
          "members_list",
          userData.docId,
        );
        await updateDoc(userRef, {
          member_name: userData.member_name,
          member_gmail: userData.member_gmail,
          member_phone: userData.member_phone,
        });
      }

      // อัปเดตข้อมูลใน localStorage เพื่อให้อัปเดตสดทันที
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...parsed,
            name: userData.member_name,
            email: userData.member_gmail,
            phone: userData.member_phone,
          }),
        );
      }

      // อัปเดตค่าตั้งต้นใหม่
      setInitialData(userData);
      alert("บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/project-boardgame" className="hover:text-orange-600">
            หน้าแรก
          </Link>
          <span>&gt;</span>
          <span className="text-gray-800 font-semibold">ข้อมูลส่วนตัว</span>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          ข้อมูลส่วนตัว
        </h1>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Card รวมบัญชีผู้ใช้ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-sm font-semibold text-gray-500 pb-2 border-b border-gray-100">
                บัญชีผู้ใช้
              </h2>

              {/* ชื่อ-นามสกุล */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                <label className="text-sm text-gray-700">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  value={userData.member_name}
                  onChange={(e) =>
                    setUserData({ ...userData, member_name: e.target.value })
                  }
                  placeholder="กรอกชื่อ-นามสกุล"
                  required
                  className="md:col-span-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* อีเมล (แก้ไขได้แล้ว) */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                <label className="text-sm text-gray-700">อีเมล</label>
                <input
                  type="email"
                  value={userData.member_gmail}
                  onChange={(e) =>
                    setUserData({ ...userData, member_gmail: e.target.value })
                  }
                  placeholder="example@gmail.com"
                  required
                  className="md:col-span-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* เบอร์โทรศัพท์ */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                <label className="text-sm text-gray-700">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  value={userData.member_phone}
                  onChange={(e) =>
                    setUserData({ ...userData, member_phone: e.target.value })
                  }
                  placeholder="08X-XXX-XXXX"
                  required
                  className="md:col-span-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* ปุ่มยกเลิก / บันทึก อยู่ด้านล่างสุดของ Card */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-full text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-gray-300 shadow-sm"
                >
                  {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
