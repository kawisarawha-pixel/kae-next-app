import { Suspense } from "react";
import Loading from "../loading";
import ShopList from "../shoplist";
import Header from "../header";

// Component ย่อยสำหรับดึงข้อมูล (ซ่อนไว้ในไฟล์เดียวกัน)
async function ShopDataFetcher() {
  let shops = {};
  try {
    const resData = await fetch(`http://localhost:8009/api/shops/`);

    if (!resData.ok) {
      throw new Error(`Network response was not ok`);
    }
    shops = await resData.json();
    console.log(`${shops}`);
  } catch (error) {
    console.log(`Error fetching data: ${error}`);
  }

  return <ShopList data={shops} />;
}

// Component หลักสำหรับ Render หน้าเว็บ
export default function ShopPage() {
  return (
    
    <div className="max-w-3xl mx-auto mt-6">
      <Header />
      <br></br><br></br><br></br><h1 className="text-3xl font-bold">เพิ่มข้อมูลยาสมุนไพร</h1>

      <Suspense fallback={<Loading />}>
        <ShopDataFetcher />
      </Suspense>
    </div>
  );
}