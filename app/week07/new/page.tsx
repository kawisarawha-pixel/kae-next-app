// Import create / update form
import ShopForm from "../components/ShopForm";

export default function NewShopPage() {
  return (
    <main className="min-h-screen bg-slate-200 p-6">
      <div className="max-w-2xl mx-auto">
         <ShopForm mode="add"/>
      </div>
    </main>
  );
}