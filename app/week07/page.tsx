import { Suspense } from "react";
import { shops } from "./components/shopItem";
import Loading from "./components/Loading";
import ShopList from "./components/ShopList";

export default async function ShopPage() {

    let shops = {};
    try {
        const resData = await fetch(`http://localhost:8009/shops/`);
        if(!resData.ok){
            throw new Error(`Network response was not ok.`);
        }
        shops = await resData.json();
        console.log(shops);
        } catch(error) {
            console.log(`Error fetching data: ${error}`);
            throw new Error(`Error fetching data: ${error}`);
        }

    return (
        <div className="max-w-3xl mx-auto mt-6">

        <h1 className="text-3xl font-bold text-center">
            shop List
        </h1>

        <Suspense fallback={<Loading />}>
            <ShopList data={shops}/>
        </Suspense>

        </div>
    );
}