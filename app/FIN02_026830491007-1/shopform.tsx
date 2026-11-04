"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams  } from "next/navigation";

const API_URL = "http://localhost:8009/api/shops";
const LIST_PAGE = "/FIN02_026830491007-1/contact2";

export default function ShopForm({ mode = "add", id: idProp = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = idProp ?? searchParams.get("id");
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    shopName: "",
    shopType: "",
    shopStatus: "",
    Suplier: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");

  // ถ้าเป็นโหมด edit ให้ดึงข้อมูลตาม id มาใส่ฟอร์ม
 useEffect(() => {
  if (!isEdit) return;

  if (!id) {
    setError("ไม่พบ ID ที่ต้องการแก้ไข");
    setFetching(false);
    return;
  }

  const loadShop = async () => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("ไม่พบข้อมูลที่ต้องการแก้ไข");
      }
      const data = await response.json();

      setForm({
        shopName: data.shopName ?? "",
        shopType: data.shopType ?? "",
        shopStatus: data.shopStatus ?? "",
        Suplier: data.Suplier ?? "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  loadShop();
}, [isEdit, id]);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `${API_URL}/${id}` : API_URL;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(isEdit ? "Failed to update shop." : "Failed to create Shop");
      }

      router.push(LIST_PAGE);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="p-6">กำลังโหลดข้อมูล...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
      <h2 className="text-2xl font-bold">
        {isEdit ? "แก้ไขข้อมูลสมุนไพร" : "เพิ่มข้อมูลสมุนไพร"}
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      {/* ชื่อสมุนไพร */}
      <div>
        <label className="block font-semibold mb-1">ชื่อสมุนไพร</label>
        <input
          type="text"
          name="shopName"
          value={form.shopName}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* รายละเอียดสมุนไพร */}
      <div>
        <label className="block font-semibold mb-1">รายละเอียดสมุนไพร</label>
        <input
          type="text"
          name="shopType"
          value={form.shopType}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* ผู้ผลิต */}
      <div>
        <label className="block font-semibold mb-1">ผู้ผลิต</label>
        <input
          type="text"
          name="Suplier"
          value={form.Suplier}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* ประเภทสมุนไพร */}
      <div>
        <label className="block font-semibold mb-1">ประเภทสมุนไพร</label>
        <select
          name="shopStatus"
          value={form.shopStatus}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        >
          <option value="">Please select</option>
          <option value="หัว">หัว</option>
          <option value="ใบ">ใบ</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Update Shop" : "Add Shop"}
        </button>

        <button
          type="button"
          onClick={() => router.push(LIST_PAGE)}
          className="bg-gray-300 px-5 py-3 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}