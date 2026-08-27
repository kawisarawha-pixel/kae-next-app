"use client";
import { useState } from "react";
import Link from "next/link";

export default function ShopList({ data }) {

    const [keyword, setKeyword] = useState("");
    const filterShops = data.filter(
        (item) => {
            const searchText = keyword.toLowerCase();
            return item.title.toLowerCase().includes(searchText)
        }
    );

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

            <div className="space-y-4">
                {
                    filterShops.map(shop => (

                        <div key={shop.id} className="border rounded-Ig p-4">
                            <h2 className="font-semibold">
                                {shop.title}
                            </h2>

                            <p>Open Status: {Status(shop.openStatus)}</p>

                            <Link href={`/week07/${shop.id}`} className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded">
                            View Detail
                            </Link>
                        </div>
                ))
            }

        </div>
    </div>
    );

}