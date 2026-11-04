"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// นำเข้า Firebase
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
} from "firebase/firestore";

// Type ข้อมูลบอร์ดเกม
interface BoardgameType {
  docId: string;
  game_id: string;
  game_name: string;
  game_category: string;
  game_price: number;
  game_quantity: number;
  game_detail: string;
  game_status: string;
  game_image: string;
  createdAt?: Timestamp | Date | string | null;
}

// Type ข้อมูลสมาชิกผู้ยืม (เพิ่ม member_id)
interface MemberType {
  member_id?: string;
  member_name: string;
  member_gmail: string;
  member_phone: string;
}

// Type ข้อมูลรายการยืม & จัดส่ง
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
  createdAt?: Timestamp | Date | string | null;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"games" | "borrows">("games");

  // State สำหรับบอร์ดเกม
  const [boardgames, setBoardgames] = useState<BoardgameType[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);

  // State สำหรับรายการยืม & ข้อมูลสมาชิก
  const [borrows, setBorrows] = useState<BorrowRecordType[]>([]);
  const [membersMap, setMembersMap] = useState<Record<string, MemberType>>({});
  const [borrowsLoading, setBorrowsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  // State สำหรับ Modal เพิ่ม/แก้ไข บอร์ดเกม
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<BoardgameType | null>(null);
  const [formData, setFormData] = useState({
    game_id: "",
    game_name: "",
    game_category: "วางแผน (Strategy)",
    game_price: 10,
    game_quantity: 1,
    game_detail: "",
    game_status: "พร้อมใช้งาน",
    game_image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State สำหรับ Modal แสดงรายละเอียดผู้ยืม
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);

  // State สำหรับ Modal ปฏิเสธการรับคืน
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingBorrow, setRejectingBorrow] =
    useState<BorrowRecordType | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // ดึงข้อมูลบอร์ดเกมทั้งหมด
  const fetchBoardgames = async () => {
    setGamesLoading(true);
    try {
      const gamesRef = collection(db, "boardgame", "detail", "boardgames_list");
      const q = query(gamesRef, orderBy("game_id", "asc"));
      const querySnapshot = await getDocs(q);

      const list: BoardgameType[] = [];
      querySnapshot.forEach((document) => {
        list.push({
          docId: document.id,
          ...(document.data() as Omit<BoardgameType, "docId">),
        });
      });

      setBoardgames(list);
    } catch (error) {
      console.error("Error fetching boardgames:", error);
    } finally {
      setGamesLoading(false);
    }
  };

  // ดึงข้อมูลรายการยืม และดึงข้อมูลสมาชิกผู้ยืมเพื่อจับคู่ข้อมูล
  const fetchBorrowsAndMembers = async () => {
    setBorrowsLoading(true);
    try {
      // ดึงสมาชิกทั้งหมดเก็บไว้เปรียบเทียบ
      const membersRef = collection(db, "boardgame", "member", "members_list");
      const membersSnapshot = await getDocs(membersRef);
      const mMap: Record<string, MemberType> = {};
      membersSnapshot.forEach((doc) => {
        const data = doc.data() as MemberType;
        if (data.member_gmail) {
          mMap[data.member_gmail.toLowerCase()] = data;
        }
      });
      setMembersMap(mMap);

      // ดึงรายการยืม
      const borrowRef = collection(
        db,
        "boardgame",
        "borrow_return",
        "borrow_list",
      );
      const q = query(borrowRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const list: BorrowRecordType[] = [];
      querySnapshot.forEach((document) => {
        list.push({
          docId: document.id,
          ...(document.data() as Omit<BorrowRecordType, "docId">),
        });
      });

      setBorrows(list);
    } catch (error) {
      console.error("Error fetching borrow list:", error);
    } finally {
      setBorrowsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBoardgames();
      fetchBorrowsAndMembers();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ฟังก์ชันสร้าง ID ถัดไป
  const generateNextGameId = async () => {
    try {
      const gamesRef = collection(db, "boardgame", "detail", "boardgames_list");
      const q = query(gamesRef, orderBy("game_id", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return "B001";
      } else {
        const lastGameId = querySnapshot.docs[0].data().game_id || "B000";
        const currentNum = parseInt(lastGameId.replace("B", ""), 10) || 0;
        return `B${String(currentNum + 1).padStart(3, "0")}`;
      }
    } catch (error) {
      console.error("Error generating game ID:", error);
      return "B001";
    }
  };

  // อัปโหลดรูปภาพ Base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("กรุณาเลือกไฟล์ภาพที่มีขนาดไม่เกิน 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          game_image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = async () => {
    setEditingGame(null);
    const nextId = await generateNextGameId();
    setFormData({
      game_id: nextId,
      game_name: "",
      game_category: "วางแผน (Strategy)",
      game_price: 10,
      game_quantity: 1,
      game_detail: "",
      game_status: "พร้อมใช้งาน",
      game_image: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (game: BoardgameType) => {
    setEditingGame(game);
    setFormData({
      game_id: game.game_id || "",
      game_name: game.game_name || "",
      game_category: game.game_category || "วางแผน (Strategy)",
      game_price: game.game_price || 0,
      game_quantity: game.game_quantity ?? 1,
      game_detail: game.game_detail || "",
      game_status: game.game_status || "พร้อมใช้งาน",
      game_image: game.game_image || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const qty = Number(formData.game_quantity);
    const autoStatus = qty > 0 ? formData.game_status : "ถูกยืมหมดแล้ว";

    try {
      if (editingGame) {
        const docRef = doc(
          db,
          "boardgame",
          "detail",
          "boardgames_list",
          editingGame.docId,
        );
        await updateDoc(docRef, {
          game_name: formData.game_name,
          game_category: formData.game_category,
          game_price: Number(formData.game_price),
          game_quantity: qty,
          game_detail: formData.game_detail,
          game_status: autoStatus,
          game_image: formData.game_image,
        });
        alert("แก้ไขข้อมูลบอร์ดเกมเรียบร้อยแล้ว!");
      } else {
        await addDoc(collection(db, "boardgame", "detail", "boardgames_list"), {
          game_id: formData.game_id,
          game_name: formData.game_name,
          game_category: formData.game_category,
          game_price: Number(formData.game_price),
          game_quantity: qty,
          game_detail: formData.game_detail,
          game_status: autoStatus,
          game_image:
            formData.game_image || "https://via.placeholder.com/400x300",
          createdAt: new Date(),
        });
        alert("เพิ่มบอร์ดเกมใหม่เรียบร้อยแล้ว!");
      }

      setIsModalOpen(false);
      fetchBoardgames();
    } catch (error) {
      console.error("Error saving boardgame:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGame = async (
    docId: string,
    gameId: string,
    gameName: string,
  ) => {
    if (confirm(`คุณต้องการลบเกม "${gameName}" (${gameId}) ใช่หรือไม่?`)) {
      try {
        await deleteDoc(
          doc(db, "boardgame", "detail", "boardgames_list", docId),
        );
        alert("ลบบอร์ดเกมเรียบร้อยแล้ว");
        fetchBoardgames();
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    }
  };

  // ปุ่มกดจัดส่งสินค้า (จาก กำลังเตรียมจัดส่ง -> กำลังจัดส่ง)
  const handleShipOrder = async (borrowDocId: string) => {
    if (!confirm("ยืนยันการจัดส่งสินค้าบอร์ดเกมชิ้นนี้ให้ลูกค้า?")) return;
    try {
      const borrowDocRef = doc(
        db,
        "boardgame",
        "borrow_return",
        "borrow_list",
        borrowDocId,
      );
      await updateDoc(borrowDocRef, { status: "กำลังจัดส่ง" });
      alert('เปลี่ยนสถานะเป็น "กำลังจัดส่ง" เรียบร้อยแล้ว');
      fetchBorrowsAndMembers();
    } catch (error) {
      console.error("Error shipping order:", error);
      alert("เกิดข้อผิดพลาดในการปรับสถานะ");
    }
  };

  // ปุ่มกดได้รับคืนแล้ว (จาก คืนแล้ว -> เสร็จสิ้น) + คืนสต๊อกให้คลัง
  const handleConfirmReturnReceived = async (
    borrowDocId: string,
    gameId: string,
  ) => {
    if (!confirm("ยืนยันว่าได้รับบอร์ดเกมคืนเรียบร้อยแล้วอย่างถูกต้อง?"))
      return;
    try {
      // เปลี่ยนสถานะรายการยืมเป็น เสร็จสิ้น
      const borrowDocRef = doc(
        db,
        "boardgame",
        "borrow_return",
        "borrow_list",
        borrowDocId,
      );
      await updateDoc(borrowDocRef, { status: "เสร็จสิ้น" });

      // คืนสต๊อกให้บอร์ดเกม
      const gamesRef = collection(db, "boardgame", "detail", "boardgames_list");
      const qGame = query(gamesRef, where("game_id", "==", gameId));
      const gameSnapshot = await getDocs(qGame);

      if (!gameSnapshot.empty) {
        const gameDoc = gameSnapshot.docs[0];
        const currentQty = gameDoc.data().game_quantity ?? 0;
        const gameDocRef = doc(
          db,
          "boardgame",
          "detail",
          "boardgames_list",
          gameDoc.id,
        );

        await updateDoc(gameDocRef, {
          game_quantity: currentQty + 1,
          game_status: "พร้อมใช้งาน",
        });
      }

      alert(
        "บันทึกการรับของคืนเสร็จสมบูรณ์ และปรับสต๊อกคืนเข้าคลังเรียบร้อยแล้ว!",
      );
      fetchBorrowsAndMembers();
      fetchBoardgames();
    } catch (error) {
      console.error("Error receiving returned game:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    }
  };

  // ปุ่มกดปฏิเสธการรับคืน
  const handleOpenRejectModal = (borrow: BorrowRecordType) => {
    setRejectingBorrow(borrow);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectingBorrow) return;
    if (!rejectReason.trim()) {
      alert("กรุณากรอกเหตุผลในการปฏิเสธการรับคืน");
      return;
    }

    try {
      const borrowDocRef = doc(
        db,
        "boardgame",
        "borrow_return",
        "borrow_list",
        rejectingBorrow.docId,
      );
      await updateDoc(borrowDocRef, {
        status: "ปฏิเสธการรับคืน",
        reject_reason: rejectReason.trim(),
      });

      alert("บันทึกการปฏิเสธการรับคืนเรียบร้อยแล้ว");
      setRejectModalOpen(false);
      fetchBorrowsAndMembers();
    } catch (error) {
      console.error("Error rejecting return:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const filteredGames = boardgames.filter(
    (g) =>
      g.game_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.game_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.game_category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredBorrows = borrows.filter(
    (b) =>
      b.game_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.member_gmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.game_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-sky-50/40 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header ระบบแอดมิน */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              ⚙️ ระบบแอดมิน (Admin Management)
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              จัดการข้อมูลบอร์ดเกม สต๊อกคงเหลือ ตรวจสอบข้อมูลผู้ยืม
              และอนุมัติการจัดส่ง/รับคืน
            </p>
          </div>

          <Link
            href="/project-boardgame"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-center"
          >
            ← กลับหน้าหลัก
          </Link>
        </div>

        {/* แถบเปลี่ยนแท็บ */}
        <div className="flex border-b border-blue-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("games")}
            className={`py-3 px-6 text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === "games"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-blue-100"
            }`}
          >
            🪅 จัดการบอร์ดเกม ({boardgames.length})
          </button>
          <button
            onClick={() => setActiveTab("borrows")}
            className={`py-3 px-6 text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === "borrows"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-blue-100"
            }`}
          >
            🚚 รายการยืม & จัดส่ง ({borrows.length})
          </button>
        </div>

        {/* ค้นหา + ปุ่มเพิ่ม */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <input
            type="text"
            placeholder={
              activeTab === "games"
                ? "🔍 ค้นหารหัส, ชื่อเกม หรือ ประเภท..."
                : "🔍 ค้นหาผู้ยืม (Gmail), ชื่อเกม หรือ รหัส..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />

          {activeTab === "games" && (
            <button
              onClick={handleOpenAddModal}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              ➕ เพิ่มบอร์ดเกมใหม่
            </button>
          )}
        </div>

        {/* TAB 1: ตารางจัดการบอร์ดเกม */}
        {activeTab === "games" && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
            {gamesLoading ? (
              <div className="p-12 text-center text-gray-500">
                กำลังโหลดข้อมูล...
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                ไม่พบข้อมูลบอร์ดเกม
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-sky-50 text-blue-950 uppercase font-bold text-xs border-b border-blue-100">
                    <tr>
                      <th className="px-4 py-4 text-center">รูปปก</th>
                      <th className="px-4 py-4">รหัสเกม</th>
                      <th className="px-6 py-4">ชื่อบอร์ดเกม</th>
                      <th className="px-4 py-4">ประเภท</th>
                      <th className="px-4 py-4">ราคา/รอบ</th>
                      <th className="px-4 py-4 text-center">คงเหลือ</th>
                      <th className="px-4 py-4 text-center">สถานะ</th>
                      <th className="px-6 py-4 text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredGames.map((game) => (
                      <tr
                        key={game.docId}
                        className="hover:bg-sky-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-center">
                          <img
                            src={
                              game.game_image ||
                              "https://via.placeholder.com/80"
                            }
                            alt={game.game_name}
                            className="w-12 h-12 rounded-lg object-cover mx-auto shadow-sm border border-gray-200 bg-gray-50"
                          />
                        </td>
                        <td className="px-4 py-4 font-bold text-blue-600">
                          {game.game_id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">
                            {game.game_name}
                          </div>
                          <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                            {game.game_detail}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-medium text-gray-700">
                          {game.game_category}
                        </td>
                        <td className="px-4 py-4 font-semibold text-gray-800">
                          {game.game_price} บาท
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-gray-700">
                          <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg">
                            {game.game_quantity ?? 1} ชิ้น
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              (game.game_quantity ?? 1) > 0 &&
                              game.game_status === "พร้อมใช้งาน"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                : "bg-rose-100 text-rose-700 border border-rose-300"
                            }`}
                          >
                            {(game.game_quantity ?? 1) > 0
                              ? game.game_status
                              : "ถูกยืมหมดแล้ว"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(game)}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            >
                              ✏️ แก้ไข
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteGame(
                                  game.docId,
                                  game.game_id,
                                  game.game_name,
                                )
                              }
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            >
                              🗑️ ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* tab รายการยืม & จัดส่ง */}
        {activeTab === "borrows" && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
            {borrowsLoading ? (
              <div className="p-12 text-center text-gray-500">
                กำลังโหลดรายการยืม...
              </div>
            ) : filteredBorrows.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                ยังไม่มีคำขอยืมบอร์ดเกมในขณะนี้
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-blue-50 text-blue-950 uppercase font-bold text-xs border-b border-blue-100">
                    <tr>
                      <th className="px-4 py-4 text-center">รูปเกม</th>
                      <th className="px-6 py-4">ข้อมูลผู้ยืม</th>
                      <th className="px-6 py-4">บอร์ดเกมที่ยืม</th>
                      <th className="px-4 py-4">วันที่ยืม - กำหนดคืน</th>
                      <th className="px-4 py-4 text-center">สถานะปัจจุบัน</th>
                      <th className="px-6 py-4 text-center">
                        การจัดการการจัดส่ง / รับคืน
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBorrows.map((record) => {
                      const memberInfo =
                        membersMap[record.member_gmail?.toLowerCase()];

                      return (
                        <tr
                          key={record.docId}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-center">
                            <img
                              src={
                                record.game_image ||
                                "https://via.placeholder.com/80"
                              }
                              alt={record.game_name}
                              className="w-12 h-12 rounded-lg object-cover mx-auto shadow-sm border border-gray-200"
                            />
                          </td>

                          {/* ข้อมูลผู้ยืม (เพิ่มการแสดงรหัสสมาชิก member_id) */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-bold text-gray-800">
                                {memberInfo?.member_name || "สมาชิก"}
                              </span>
                              {memberInfo?.member_id && (
                                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                                  {memberInfo.member_id}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {record.member_gmail}
                            </div>
                            {memberInfo?.member_phone && (
                              <div className="text-xs text-gray-400">
                                📞 {memberInfo.member_phone}
                              </div>
                            )}
                            <button
                              onClick={() =>
                                setSelectedMember(
                                  memberInfo || {
                                    member_id: "ไม่ระบุ",
                                    member_name: "สมาชิกทั่วไป",
                                    member_gmail: record.member_gmail,
                                    member_phone: "ไม่ระบุ",
                                  },
                                )
                              }
                              className="mt-1 text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                            >
                              ดูข้อมูลผู้ยืม
                            </button>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-bold text-blue-600">
                              {record.game_name}
                            </div>
                            <div className="text-xs text-gray-400">
                              รหัส: {record.game_id}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-xs space-y-0.5">
                            <div>
                              📅 ยืม:{" "}
                              <span className="font-medium text-gray-800">
                                {record.borrow_date}
                              </span>
                            </div>
                            <div>
                              🔄 คืน:{" "}
                              <span className="font-medium text-gray-800">
                                {record.return_date}
                              </span>
                            </div>
                          </td>

                          {/* แสดง Badge สถานะปัจจุบัน */}
                          <td className="px-4 py-4 text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                record.status === "เสร็จสิ้น"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : record.status === "คืนแล้ว"
                                    ? "bg-purple-100 text-purple-800 border border-purple-300"
                                    : record.status === "จัดส่งสำเร็จ"
                                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                                      : record.status === "กำลังจัดส่ง"
                                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                                        : record.status === "ปฏิเสธการรับคืน"
                                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                                          : "bg-orange-100 text-orange-800 border border-orange-300"
                              }`}
                            >
                              {record.status === "กำลังเตรียมจัดส่ง"
                                ? "📦 รอแอดมินจัดส่ง"
                                : record.status === "กำลังจัดส่ง"
                                  ? "🚚 กำลังจัดส่ง"
                                  : record.status === "จัดส่งสำเร็จ"
                                    ? "✅ ลูกค้ารับของแล้ว"
                                    : record.status === "คืนแล้ว"
                                      ? "🔄 ลูกค้าส่งคืนแล้ว"
                                      : record.status === "เสร็จสิ้น"
                                        ? "✨ สำเร็จ (รับคืนแล้ว)"
                                        : "❌ ปฏิเสธการรับคืน"}
                            </span>
                            {record.reject_reason && (
                              <div className="text-xs text-rose-600 mt-1 max-w-xs italic">
                                เหตุผล: {record.reject_reason}
                              </div>
                            )}
                          </td>

                          {/* ปุ่ม Action กดเปลี่ยนสถานะ */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col gap-1.5 items-center justify-center">
                              {/* เมื่อเพิ่งยืม -> ปุ่มจัดส่งสินค้า */}
                              {record.status === "กำลังเตรียมจัดส่ง" && (
                                <button
                                  onClick={() => handleShipOrder(record.docId)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                                >
                                  🚚 จัดส่งสินค้า
                                </button>
                              )}

                              {/* เมื่อกำลังจัดส่ง -> รอผู้รับ */}
                              {record.status === "กำลังจัดส่ง" && (
                                <span className="text-xs text-amber-600 font-medium italic">
                                  ⏳ รอลูกค้ากดยืนยันรับสินค้า...
                                </span>
                              )}

                              {/* เมื่อลูกค้าได้ของแล้ว -> รอส่งคืน */}
                              {record.status === "จัดส่งสำเร็จ" && (
                                <span className="text-xs text-blue-600 font-medium italic">
                                  📦 ลูกค้ากำลังใช้งาน (รอส่งคืน)...
                                </span>
                              )}

                              {/* เมื่อลูกค้ากดส่งคืนมาแล้ว -> ปุ่มรับคืน หรือ ปฏิเสธ */}
                              {record.status === "คืนแล้ว" && (
                                <div className="flex flex-col gap-1.5 w-full max-w-[160px]">
                                  <button
                                    onClick={() =>
                                      handleConfirmReturnReceived(
                                        record.docId,
                                        record.game_id,
                                      )
                                    }
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                                  >
                                    ✅ ได้รับของคืนแล้ว
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleOpenRejectModal(record)
                                    }
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1 rounded-xl text-xs font-bold transition-all"
                                  >
                                    ❌ ปฏิเสธการรับคืน
                                  </button>
                                </div>
                              )}

                              {/* สถานะเสร็จสิ้น / ปฏิเสธ */}
                              {record.status === "เสร็จสิ้น" && (
                                <span className="text-xs text-emerald-600 font-bold">
                                  🎉 ทำรายการเรียบร้อย
                                </span>
                              )}

                              {record.status === "ปฏิเสธการรับคืน" && (
                                <span className="text-xs text-rose-600 font-bold">
                                  🚫 ปฏิเสธการคืนแล้ว
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* MODAL ดูรายละเอียดผู้ยืม (แสดง member_id) */}
      {/* -------------------------------------------------- */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                รายละเอียดข้อมูลผู้ยืม
              </h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-blue-600 font-bold mb-0.5">
                    ชื่อ-นามสกุล
                  </p>
                  <p className="text-base font-bold text-gray-800">
                    {selectedMember.member_name || "ไม่ระบุชื่อ"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-600 font-bold mb-0.5">
                    รหัสสมาชิก
                  </p>
                  <span className="bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded-md">
                    {selectedMember.member_id || "ไม่ระบุ"}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                <div>
                  <p className="text-xs text-gray-400 font-semibold">
                    อีเมลติดต่อ (Gmail)
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedMember.member_gmail}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold">
                    เบอร์โทรศัพท์
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedMember.member_phone || "ไม่ระบุเบอร์โทรศัพท์"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 text-right">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* MODAL ปฏิเสธการรับคืนสินค้า */}
      {/* -------------------------------------------------- */}
      {rejectModalOpen && rejectingBorrow && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-rose-600 flex items-center gap-2">
                ❌ ปฏิเสธการรับคืนบอร์ดเกม
              </h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-4 text-sm">
              <p className="text-gray-600">
                คุณกำลังปฏิเสธการรับคืนเกม{" "}
                <span className="font-bold text-gray-800">
                  &quot;{rejectingBorrow.game_name}&quot;
                </span>{" "}
                จากผู้ยืม{" "}
                <span className="font-bold text-gray-800">
                  {rejectingBorrow.member_gmail}
                </span>
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ระบุเหตุผลในการปฏิเสธ (ชำรุด / อุปกรณ์หาย / ส่งคืนผิดชิ้น)
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="เช่น กล่องชำรุดเสียหาย, การ์ดขาดหายไป 3 ใบ..."
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none bg-rose-50/30"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="w-1/2 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmReject}
                className="w-1/2 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                ยืนยันการปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL เพิ่ม / แก้ไข บอร์ดเกม */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                {editingGame
                  ? "✏️ แก้ไขข้อมูลบอร์ดเกม"
                  : "➕ เพิ่มบอร์ดเกมใหม่"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    รหัสเกม (Game ID)
                  </label>
                  <input
                    type="text"
                    value={formData.game_id}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-blue-600 font-bold text-sm cursor-not-allowed focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    สถานะ
                  </label>
                  <select
                    value={formData.game_status}
                    onChange={(e) =>
                      setFormData({ ...formData, game_status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="พร้อมใช้งาน">พร้อมใช้งาน</option>
                    <option value="ถูกยืมแล้ว">ถูกยืมแล้ว</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  ชื่อบอร์ดเกม
                </label>
                <input
                  type="text"
                  required
                  value={formData.game_name}
                  onChange={(e) =>
                    setFormData({ ...formData, game_name: e.target.value })
                  }
                  placeholder="เช่น Catan, Codenames"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    ประเภทเกม
                  </label>
                  <select
                    value={formData.game_category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        game_category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="วางแผน (Strategy)">วางแผน</option>
                    <option value="ปาร์ตี้ (Party)">ปาร์ตี้</option>
                    <option value="ครอบครัว (Family)">ครอบครัว</option>
                    <option value="การ์ดเกม (Card Game)">การ์ดเกม</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    ราคา/รอบ (บาท)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.game_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        game_price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-blue-600 mb-1">
                    สต๊อกให้ยืม (ชิ้น)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.game_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        game_quantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-blue-300 bg-sky-50 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  รูปภาพปกบอร์ดเกม
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-bluee-700 hover:file:bg-blue-100 cursor-pointer"
                />

                {formData.game_image && (
                  <div className="mt-3 flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <img
                      src={formData.game_image}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                    />
                    <span className="text-xs text-gray-500">
                      ตัวอย่างรูปภาพที่เลือก
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  รายละเอียดเกี่ยวกับเกม
                </label>
                <textarea
                  rows={3}
                  value={formData.game_detail}
                  onChange={(e) =>
                    setFormData({ ...formData, game_detail: e.target.value })
                  }
                  placeholder="คำอธิบายเกี่ยวกับวิธีการเล่น..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 mt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2 px-4 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2 px-4 rounded-xl text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
