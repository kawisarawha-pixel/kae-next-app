import { Suspense } from "react";
import ShopForm from "../shopform";

export default async function EditPage({ searchParams }) {
  const { id } = await searchParams;

  return (
    <main className="min-h-screen bg-slate-200 p-6">
      <div className="max-w-2xl mx-auto">
        <ShopForm mode="edit" id={id} />
      </div>
    </main>
  );
}