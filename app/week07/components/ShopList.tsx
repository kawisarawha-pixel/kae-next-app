"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ShopList({ data }) {

    // const router = useRouter();
    const [keyword, setKeyword] = useState("");

    const filterShops = data.filter(
        (item) => {
            const searchText = keyword.toLowerCase();
            return item.shopName.toLowerCase().includes(searchText)
        }
    );

     // เพิ่มคำสั่งภายใน component ShopList ส่วนของ Script
  const router = useRouter();

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
        "Are you sure you want to delete this shop?"
        );

        if (!confirmed) return;

        try {
        const response = await fetch(
            `http://localhost:8009/api/shops/${id}`,
        {
        method: "DELETE",
        }
    );

        if (!response.ok) {
            throw new Error("Failed to delete Shop");
        }
        // Refresh page
        router.refresh();
        } catch (error) {
        alert(error.message);
        }
    };


    const Status = (status: boolean) => {
        if(status)
            return <span style={{ color: "green" }}>open</span>
        return <span style={{ color: "red"}}>closed</span>
    }

    return (

        <div className="max-w-3xl ma-auto p-6">

            {/* Search */}
            <div className="mb-6">

            <input
                type="text"
                value={keyword}
                onChange={(e) =>
                setKeyword(e.target.value)
            }
            
          placeholder="Search shop..." className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </div>

            <div className="mb-4 text-gray-600">
                Found {data.length} shop(s)
            </div>

        {/* A */}
        {/* เพิ่มปุ่มเพื่อสร้างร้านค้า โดยระบุไว้ในของส่วนการแสดงผลไปยังผู้ใช้ตำแหน่งใด ๆ */}
        <div className="flex justify-between items-center">
            <Link href="/week07/new"
            className="bg-green-600 text-white px-3 py-2 rounded-lg">
                + Add New
            </Link>
        </div>


            <div className="space-y-4">
                {
                    filterShops.map(shop => (

                        <div key={shop.shopId} className="border rounded-Ig p-4">
                            <h2 className="font-semibold">
                                {shop.shopName}
                            </h2>
                            

                            <p>Open Status: {Status(shop.shopStatus)}</p>

                            <Link href={`/week07/${shop.id}`} className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                            View Detail
                            </Link>
                            {/* B */}
                            {/* เพิ่มปุ่มเพื่อแก้ไขข้อมูลร้านค้า โดยระบุไว้ในของส่วนการแสดงผลไปยังผู้ใช้ */}
                            <Link href={`/week07/${shop.id}/edit`}
                                className="bg-yellow-500 text-white px-3 py-2 rounded-lg">
                                    Update
                            </Link>
                            {/* C */}
                            {/* เพิ่มปุ่มเพื่อลบร้านค้า โดยระบุไว้ในของส่วนการแสดงผลไปยังผู้ใช้ */}
                            <button onClick={(e)=>handleDelete(`${shop.id}`)}
                                className="bg-red-500 text-white px-3 py-2 rounded-lg">
                                Delete
                            </button>
                        </div>
                ))
            }

        </div>
    </div>
    );

}