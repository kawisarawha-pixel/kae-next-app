"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "./components/headerB";
import Footer from "./components/footerB";

// นำเข้า Firebase
import { db } from "./firebase/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

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
}

interface CartItemType {
  game: BoardgameType;
  borrowQty: number;
}

function BoardgameContent() {
  const [boardgames, setBoardgames] = useState<BoardgameType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State สำหรับ ตะกร้าการยืมบอร์ดเกม (ยืมหลายเกมได้)
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State สำหรับ Modal แสดงรายละเอียดเกม
  const [selectedGame, setSelectedGame] = useState<BoardgameType | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "ทั้งหมด";

  // ดึงข้อมูลบอร์ดเกมจาก Firebase
  const fetchBoardgames = async () => {
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
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBoardgames();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ฟังก์ชันเพิ่มลงตะกร้า
  const handleAddToCart = (game: BoardgameType) => {
    const availableQty =
      game.game_quantity !== undefined ? Number(game.game_quantity) : 1;
    if (availableQty <= 0) {
      alert("ขออภัย บอร์ดเกมนี้ถูกยืมหมดแล้ว");
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.game.docId === game.docId,
      );
      if (existingIndex > -1) {
        const currentBorrowQty = prevCart[existingIndex].borrowQty;
        if (currentBorrowQty >= availableQty) {
          alert(
            `สามารถยืมเกม "${game.game_name}" ได้สูงสุด ${availableQty} ชิ้น (เท่าจำนวนคงเหลือ)`,
          );
          return prevCart;
        }
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].borrowQty += 1;
        return updatedCart;
      } else {
        return [...prevCart, { game, borrowQty: 1 }];
      }
    });
  };

  // ปรับจำนวนสินค้าในตะกร้า
  const handleUpdateCartQty = (docId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.game.docId === docId) {
            const availableQty = item.game.game_quantity ?? 1;
            const newQty = item.borrowQty + delta;
            if (newQty > availableQty) {
              alert(`จำนวนสินค้าคงเหลือมีเพียง ${availableQty} ชิ้น`);
              return item;
            }
            return { ...item, borrowQty: newQty };
          }
          return item;
        })
        .filter((item) => item.borrowQty > 0);
    });
  };

  // ลบออกจากตะกร้า
  const handleRemoveFromCart = (docId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.game.docId !== docId));
  };

  // ฟังก์ชันยืนยันการยืมทั้งหมดในตะกร้า
  const handleConfirmBorrowAll = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการยืมบอร์ดเกม");
      router.push("/project-boardgame/login");
      return;
    }

    if (cart.length === 0) {
      alert("ตะกร้าของคุณยังไม่มีบอร์ดเกม");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const userEmail = parsedUser.email || "";

    if (
      !confirm(
        `คุณต้องการยืนยันการยืมบอร์ดเกมจำนวน ${cart.reduce((a, b) => a + b.borrowQty, 0)} ชิ้น ใช่หรือไม่?`,
      )
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const today = new Date();
      const returnDate = new Date();
      returnDate.setDate(today.getDate() + 7);

      const formatDate = (date: Date) =>
        `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1,
        ).padStart(2, "0")}/${date.getFullYear()}`;

      // ทำรายการยืมสำหรับทุกรายการในตะกร้า
      for (const item of cart) {
        for (let i = 0; i < item.borrowQty; i++) {
          await addDoc(
            collection(db, "boardgame", "borrow_return", "borrow_list"),
            {
              game_id: item.game.game_id,
              game_name: item.game.game_name,
              game_image: item.game.game_image,
              borrow_date: formatDate(today),
              return_date: formatDate(returnDate),
              status: "กำลังเตรียมจัดส่ง",
              member_gmail: userEmail,
              createdAt: new Date(),
            },
          );
        }

        // ตัดสต๊อกตามจำนวนที่ยืม
        const currentQty = item.game.game_quantity ?? 1;
        const newQty = Math.max(0, currentQty - item.borrowQty);
        const gameRef = doc(
          db,
          "boardgame",
          "detail",
          "boardgames_list",
          item.game.docId,
        );

        await updateDoc(gameRef, {
          game_quantity: newQty,
          game_status: newQty > 0 ? "พร้อมใช้งาน" : "ถูกยืมหมดแล้ว",
        });
      }

      alert(
        "ยืมบอร์ดเกมทั้งหมดสำเร็จ! สามารถติดตามสถานะจัดส่งได้ที่หน้าประวัติการยืม",
      );
      setCart([]);
      setIsCartOpen(false);
      setSelectedGame(null);
      fetchBoardgames();
    } catch (error) {
      console.error("Error borrowing games:", error);
      alert("เกิดข้อผิดพลาดในการยืมบอร์ดเกม");
    } finally {
      setIsSubmitting(false);
    }
  };

  // กรองบอร์ดเกมตามคำค้นหา/หมวดหมู่
  const filteredGames = boardgames.filter((game) => {
    const matchSearch =
      !urlSearch ||
      game.game_name.toLowerCase().includes(urlSearch.toLowerCase()) ||
      game.game_category.toLowerCase().includes(urlSearch.toLowerCase());

    const matchCategory =
      urlCategory === "ทั้งหมด" ||
      game.game_category.toLowerCase().includes(urlCategory.toLowerCase());

    return matchSearch && matchCategory;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.borrowQty, 0);
  const totalCartPrice = cart.reduce(
    (sum, item) => sum + item.game.game_price * item.borrowQty,
    0,
  );

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative">
      {/* Header ส่วนเนื้อหา */}
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 pb-2 border-b border-gray-200 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block"></span>
            {urlCategory !== "ทั้งหมด"
              ? `หมวดหมู่: ${urlCategory}`
              : "แนะนำสำหรับคุณ"}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {urlSearch
              ? `ผลการค้นหาสำหรับ "${urlSearch}"`
              : "เลือกบอร์ดเกมที่ต้องการยืมลงตะกร้า แล้วกดยืนยันพร้อมกันทีเดียว"}
          </p>
        </div>

        {(urlSearch || urlCategory !== "ทั้งหมด") && (
          <button
            onClick={() => router.push("/project-boardgame")}
            className="text-xs text-orange-600 font-semibold hover:underline self-start md:self-auto"
          >
            ✕ ล้างการค้นหาทั้งหมด
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          กำลังโหลดข้อมูล...
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
          ไม่พบบอร์ดเกมที่ตรงกับการค้นหา
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => {
            const qty =
              game.game_quantity !== undefined ? Number(game.game_quantity) : 1;
            const isAvailable = qty > 0;
            const cartItem = cart.find(
              (item) => item.game.docId === game.docId,
            );
            const inCartQty = cartItem ? cartItem.borrowQty : 0;

            return (
              <div
                key={game.docId}
                onClick={() => setSelectedGame(game)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col group cursor-pointer relative"
              >
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={
                      game.game_image || "https://via.placeholder.com/400x300"
                    }
                    alt={game.game_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <span
                    className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-md text-white shadow-sm ${
                      isAvailable ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  >
                    {isAvailable ? "พร้อมใช้งาน" : "ถูกยืมหมดแล้ว"}
                  </span>

                  {inCartQty > 0 && (
                    <span className="absolute top-3 right-3 bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md">
                      ในตะกร้า {inCartQty} ชิ้น
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                        {game.game_category}
                      </span>

                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        คงเหลือ: {qty} ชิ้น
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-blue-600 transition-colors mt-2">
                      {game.game_name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {game.game_detail}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400">
                        ค่าบริการ/รอบ
                      </span>
                      <div className="text-base font-bold text-blue-600">
                        {game.game_price} บาท
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(game);
                      }}
                      disabled={!isAvailable}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        isAvailable
                          ? "bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      🛒 {isAvailable ? "ใส่ตะกร้า" : "สินค้าหมด"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🛒 ปุ่มตะกร้าสินค้าแบบ Floating (มุมขวาล่าง) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 transition-transform hover:scale-105"
          >
            <div className="relative">
              <span className="text-2xl">🛒</span>
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                {totalCartCount}
              </span>
            </div>
            <div className="text-left hidden sm:block pr-2">
              <div className="text-xs text-blue-100">
                ตะกร้าการยืม ({cart.length} รายการ)
              </div>
              <div className="text-sm font-bold">{totalCartPrice} บาท/รอบ</div>
            </div>
          </button>
        </div>
      )}

      {/* Modal แสดงตะกร้าสินค้า */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col relative">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-sky-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                🛒 ตะกร้าการยืมบอร์ดเกม ({totalCartCount} ชิ้น)
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {cart.map((item) => (
                <div
                  key={item.game.docId}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100"
                >
                  <img
                    src={
                      item.game.game_image || "https://via.placeholder.com/80"
                    }
                    alt={item.game.game_name}
                    className="w-16 h-16 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm">
                      {item.game.game_name}
                    </h4>
                    <div className="text-xs text-blue-600 font-semibold">
                      {item.game.game_price} บาท/รอบ
                    </div>
                  </div>

                  {/* ปุ่มปรับจำนวน */}
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => handleUpdateCartQty(item.game.docId, -1)}
                      className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-sm flex items-center justify-center text-gray-600"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-gray-800 px-1">
                      {item.borrowQty}
                    </span>
                    <button
                      onClick={() => handleUpdateCartQty(item.game.docId, 1)}
                      className="w-6 h-6 rounded-lg bg-blue-100 hover:bg-blue-200 font-bold text-sm flex items-center justify-center text-blue-600"
                    >
                      +
                    </button>
                  </div>

                  {/* ปุ่มลบ */}
                  <button
                    onClick={() => handleRemoveFromCart(item.game.docId)}
                    className="text-gray-400 hover:text-rose-500 font-bold p-1"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* ส่วนสรุปรวม + ยืนยันการยืม */}
            <div className="p-6 bg-white border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">ราคารวมบริการเช่าทั้งหมด:</span>
                <span className="text-xl font-bold text-blue-600">
                  {totalCartPrice} บาท/รอบ
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-1/3 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm"
                >
                  เลือกเกมเพิ่ม
                </button>
                <button
                  onClick={handleConfirmBorrowAll}
                  disabled={isSubmitting}
                  className="w-2/3 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md text-sm disabled:bg-gray-300"
                >
                  {isSubmitting
                    ? "กำลังดำเนินการ..."
                    : "ยืนยันการยืมบอร์ดเกมทั้งหมด"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal รายละเอียดบอร์ดเกม */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
            >
              ✕
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 shrink-0">
              <img
                src={
                  selectedGame.game_image ||
                  "https://via.placeholder.com/400x300"
                }
                alt={selectedGame.game_name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">
                    {selectedGame.game_category}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md text-white ${
                      Number(selectedGame.game_quantity) > 0
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                    }`}
                  >
                    {Number(selectedGame.game_quantity) > 0
                      ? `คงเหลือ ${selectedGame.game_quantity} ชิ้น`
                      : "สินค้าหมด"}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedGame.game_name}
                </h2>

                <div className="border-t border-b border-gray-100 py-3 my-3">
                  <h4 className="text-xs font-bold text-gray-700 mb-1">
                    รายละเอียดบอร์ดเกม:
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedGame.game_detail || "ไม่มีรายละเอียดเพิ่มเติม"}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">
                    ค่าบริการ/รอบ
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedGame.game_price}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      บาท
                    </span>
                  </span>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(selectedGame);
                    setSelectedGame(null);
                    setIsCartOpen(true);
                  }}
                  disabled={Number(selectedGame.game_quantity) <= 0}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                    Number(selectedGame.game_quantity) > 0
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  🛒 ใส่ตะกร้า
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function BoardgamePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
      <Header />
      <Suspense
        fallback={
          <div className="text-center py-20 text-gray-500">กำลังโหลด...</div>
        }
      >
        <BoardgameContent />
      </Suspense>
      <Footer />
    </div>
  );
}
