"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
//import LoginButton from "./Login";
//import LogoutButton from "./Logout";

export default function ShopList({ data }) {
  // 1. ใช้ State เพื่อเก็บข้อมูล User 
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // 2. ใช้ useEffect ดึงข้อมูลจาก localStorage เมื่อ Component โหลดเสร็จ
  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // แปลงข้อความ JSON กลับเป็น Object
    }
  }, []);

  const [keyword, setKeyword] = useState("");
  
  const filterShops = data.filter((item) => {
    const searchText = keyword.toLowerCase();
    return item.shopName.toLowerCase().includes(searchText);
  });

  const router = useRouter();



  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shop?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8009/api/shops/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete Shop");
      }
      router.refresh();
    } catch (error) {
      alert(error.message);
    }
  };

  const Status = (sta: boolean) => {
    if (sta) return <span style={{ color: "green" }}>หัว</span>;
    return <span style={{ color: "green" }}>ใบ</span>;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      
      {/* --- ส่วนกล่อง Profile ด้านบน --- */}
      <div className="">
        
        {/* 3. เช็คเงื่อนไข: ถ้ามี User ให้แสดงโปรไฟล์ ถ้าไม่มีให้แสดงข้อความทักทายทั่วไป */}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="">
              {/* เอาตัวอักษรตัวแรกของชื่อมาทำเป็นไอคอน */}
              {/* {user.name ? user.name.charAt(0) : "U"}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
                Welcome back
              </p>
              <h2 className="text-lg font-bold text-gray-800">
                {user.name} 👋
              </h2>
              <p className="text-xs text-gray-500">Manage your shops here</p> */}
            </div>
          </div>
        ) : (
          <div className="">
            {/* <div>
              <h2 className="text-lg font-bold text-gray-800">
                Please Login
              </h2>
              <p className="text-xs text-gray-500">to manage your shops</p>
            </div> */}
          </div>
        )}

         {/*<div className="shrink-0">
          แสดงปุ่ม Login/Logout ตามสถานะ 
          {isMounted && (user ? <LogoutButton /> : <LoginButton />)}
        </div>*/}
      </div>
      {/* ------------------------------- */}

      <br></br>
      <div className="mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search shop..."
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4 text-gray-600">Found {filterShops.length} shop(s)</div>

      <div className="flex justify-between items-center">
        <Link
          href="/FIN02_026830491007-1/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Herb
        </Link>
      </div>
      <br></br>

      <div className="space-y-4">
        {filterShops.map((shop) => (
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold">{shop.shopName}</h2>
            <p className="my-2">ประเภทสมุนไพร: {Status(shop.shopStatus)} </p>
            <p className="my-2">รายละเอียดสมุนไพร: {shop.shopType} </p>
            <p className="my-2">ผู้ผลิต: {shop.Suplier} </p>
            
            {/* <Link
              href={`/week07/${shop.id}`}
              className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              View Detail
            </Link> */}
            <Link
              href={`/FIN02_026830491007-1/edit?id=${shop.id}`}
                className="ms-1 bg-green-500 text-white px-3 py-2 rounded"
              >
              Edit
            </Link>
            <button
              onClick={(e) => handleDelete(`${shop.id}`)}
              className="ms-1 bg-red-500 text-white px-3 py-2 rounded"
            >
              Delete
            </button>
            
            {/* <Link
              href={`/week07/${shop.id}/edit`}
              className="ms-1 bg-yellow-500 text-white px-3 py-2 rounded"
            >
              Update
            </Link> */}
          </div>
        ))}
      </div>
    </div>
  );
}