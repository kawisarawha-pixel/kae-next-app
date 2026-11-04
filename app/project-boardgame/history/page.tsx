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
  doc,
  updateDoc,
} from "firebase/firestore";

interface BorrowRecordType {
  docId: string;
  game_id: string;
  game_name: string;
  game_image: string;
  borrow_date: string;
  return_date: string;
  status:
    | "กำลังเตรียมจัดส่ง"
    | "กำลังจัดส่ง"
    | "จัดส่งสำเร็จ"
    | "คืนแล้ว"
    | "เสร็จสิ้น"
    | "ปฏิเสธการรับคืน";
  member_gmail: string;
  reject_reason?: string;
}

export default function HistoryPage() {
  const [historyList, setHistoryList] = useState<BorrowRecordType[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลประวัติการยืมของผู้ใช้
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const userEmail = parsedUser.email || "";

      const borrowRef = collection(
        db,
        "boardgame",
        "borrow_return",
        "borrow_list",
      );
      const q = query(borrowRef, where("member_gmail", "==", userEmail));
      const querySnapshot = await getDocs(q);

      const list: BorrowRecordType[] = [];
      querySnapshot.forEach((document) => {
        list.push({
          docId: document.id,
          ...(document.data() as Omit<BorrowRecordType, "docId">),
        });
      });

      setHistoryList(list);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ฟังก์ชันยืนยันรับสินค้า
  const handleConfirmReceive = async (docId: string, gameName: string) => {
    if (
      !confirm(
        `ยืนยันว่าคุณได้รับบอร์ดเกม "${gameName}" เรียบร้อยแล้วใช่หรือไม่?`,
      )
    ) {
      return;
    }

    try {
      const borrowDocRef = doc(
        db,
        "boardgame",
        "borrow_return",
        "borrow_list",
        docId,
      );
      await updateDoc(borrowDocRef, {
        status: "จัดส่งสำเร็จ",
      });

      alert("ยืนยันการรับสินค้าสำเร็จ! ขอให้สนุกกับการเล่นบอร์ดเกมค่ะ");
      fetchHistory();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาดในการยืนยันการรับสินค้า");
    }
  };

  // ฟังก์ชันส่งคืนสินค้า (อัปเดตสถานะเป็น "คืนแล้ว" เพื่อรอแอดมินตรวจรับ)
  const handleReturnGame = async (docId: string, gameName: string) => {
    if (
      !confirm(
        `คุณต้องการส่งคืนบอร์ดเกม "${gameName}" ใช่หรือไม่?\n(เมื่อกดแล้วสถานะจะถูกเปลี่ยนเป็น "คืนแล้ว" และรอแอดมินตรวจสอบสินค้า)`,
      )
    ) {
      return;
    }

    try {
      const borrowDocRef = doc(
        db,
        "boardgame",
        "borrow_return",
        "borrow_list",
        docId,
      );
      await updateDoc(borrowDocRef, {
        status: "คืนแล้ว",
      });

      alert(
        "แจ้งส่งคืนบอร์ดเกมเรียบร้อยแล้ว! กรุณารอแอดมินตรวจสอบการรับคืนครับ",
      );
      fetchHistory();
    } catch (error) {
      console.error("Error returning game:", error);
      alert("เกิดข้อผิดพลาดในการส่งคืนบอร์ดเกม");
    }
  };

  // ฟังก์ชันส่งคืนใหม่อีกครั้ง (กรณีถูกปฏิเสธการรับคืน)
  const handleResubmitReturn = async (docId: string) => {
    if (
      !confirm("คุณต้องการยืนยันแจ้งส่งคืนบอร์ดเกมใหม่อีกครั้ง ใช่หรือไม่?")
    ) {
      return;
    }

    try {
      const borrowDocRef = doc(
        db,
        "boardgame",
        "borrow_return",
        "borrow_list",
        docId,
      );
      await updateDoc(borrowDocRef, {
        status: "คืนแล้ว",
        reject_reason: "", // ล้างเหตุผลการปฏิเสธออก
      });

      alert("แจ้งส่งคืนใหม่อีกครั้งเรียบร้อยแล้ว กรุณารอแอดมินตรวจสอบครับ");
      fetchHistory();
    } catch (error) {
      console.error("Error resubmitting return:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/project-boardgame" className="hover:text-blue-600">
            หน้าแรก
          </Link>
          <span>&gt;</span>
          <span className="text-gray-800 font-semibold">
            ประวัติการยืมบอร์ดเกม
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block"></span>
          ประวัติการยืมและการจัดส่ง
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          ติดตามสถานะการจัดส่งบอร์ดเกมของคุณ กดยืนยันเมื่อได้รับสินค้า
          หรือส่งคืนเมื่อเล่นเสร็จ
        </p>

        {loading ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
            กำลังโหลดข้อมูลประวัติของคุณ...
          </div>
        ) : historyList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-4xl mb-4">📦</span>
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              คุณยังไม่มีประวัติการยืมบอร์ดเกม
            </h3>
            <Link
              href="/project-boardgame"
              className="mt-4 px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-colors"
            >
              ไปเลือกดูบอร์ดเกม
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {historyList.map((record) => (
              <div
                key={record.docId}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={record.game_image || "https://via.placeholder.com/150"}
                    alt={record.game_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {record.game_name}
                      </h3>
                      <div className="text-xs text-gray-400">
                        รหัสบอร์ดเกม: {record.game_id}
                      </div>
                    </div>

                    {/* แสดง Badge สถานะปัจจุบัน */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                        record.status === "เสร็จสิ้น"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : record.status === "จัดส่งสำเร็จ"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : record.status === "กำลังจัดส่ง"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : record.status === "คืนแล้ว"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : record.status === "ปฏิเสธการรับคืน"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : "bg-orange-50 text-orange-700 border-orange-200"
                      }`}
                    >
                      {record.status === "กำลังเตรียมจัดส่ง"
                        ? "📦 กำลังเตรียมจัดส่ง"
                        : record.status === "กำลังจัดส่ง"
                          ? "🚚 กำลังจัดส่ง"
                          : record.status === "จัดส่งสำเร็จ"
                            ? "✅ จัดส่งสำเร็จ (กำลังเล่น)"
                            : record.status === "คืนแล้ว"
                              ? "🔄 แจ้งคืนแล้ว (รอตรวจสอบ)"
                              : record.status === "เสร็จสิ้น"
                                ? "✨ คืนสำเร็จเรียบร้อย"
                                : "❌ ปฏิเสธการรับคืน"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>
                      📅{" "}
                      <span className="font-semibold text-gray-800">
                        วันที่ยืม:
                      </span>{" "}
                      {record.borrow_date}
                    </p>
                    <p>
                      🔄{" "}
                      <span className="font-semibold text-gray-800">
                        กำหนดคืนภายใน:
                      </span>{" "}
                      {record.return_date}
                    </p>
                  </div>

                  {/* 🚨 กรณีถูกแอดมินปฏิเสธการรับคืน */}
                  {record.status === "ปฏิเสธการรับคืน" && (
                    <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                        <span>⚠️</span>
                        <span>เหตุผลที่ปฏิเสธการรับคืนจากเจ้าหน้าที่:</span>
                      </div>
                      <p className="text-xs text-rose-900 bg-white p-2.5 rounded-lg border border-rose-100 font-medium">
                        {record.reject_reason ||
                          "บอร์ดเกมมีชิ้นส่วนไม่ครบหรือชำรุดเสียหาย"}
                      </p>
                      <div className="pt-1 flex flex-col sm:flex-row gap-2">
                        <a
                          href="tel:021234567"
                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition-colors shadow-sm"
                        >
                          📞 ติดต่อเจ้าหน้าที่
                        </a>
                        <button
                          onClick={() => handleResubmitReturn(record.docId)}
                          className="flex-1 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold py-2 px-3 rounded-lg text-center transition-colors"
                        >
                          🔄 ส่งคืนใหม่อีกครั้ง
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ปุ่ม Action */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    {record.status === "กำลังจัดส่ง" ? (
                      <button
                        onClick={() =>
                          handleConfirmReceive(record.docId, record.game_name)
                        }
                        className="w-full sm:w-auto px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
                      >
                        ✅ ยืนยันได้รับสินค้าแล้ว
                      </button>
                    ) : record.status === "กำลังเตรียมจัดส่ง" ? (
                      <div className="text-sm text-gray-400 italic">
                        *รอแอดมินจัดส่งสินค้า...
                      </div>
                    ) : record.status === "จัดส่งสำเร็จ" ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
                        <div className="text-sm text-emerald-600 font-semibold flex items-center gap-1">
                          <span>✨</span> คุณได้รับสินค้าเรียบร้อยแล้ว
                          ขอให้สนุกกับการเล่น!
                        </div>
                        <button
                          onClick={() =>
                            handleReturnGame(record.docId, record.game_name)
                          }
                          className="w-full sm:w-auto px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
                        >
                          🔄 ส่งคืนบอร์ดเกม
                        </button>
                      </div>
                    ) : record.status === "คืนแล้ว" ? (
                      <div className="text-sm text-purple-600 font-semibold italic">
                        ⏳ แจ้งคืนสินค้าแล้ว
                        (รอแอดมินตรวจสอบเพื่อเสร็จสิ้นรายการ)
                      </div>
                    ) : record.status === "เสร็จสิ้น" ? (
                      <div className="text-sm text-emerald-600 font-bold flex items-center gap-1">
                        <span>🎉</span> รายการนี้เสร็จสิ้นเรียบร้อยแล้ว
                        ขอบคุณที่ใช้บริการค่ะ !
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
