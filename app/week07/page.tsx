import { Suspense } from "react";
import { shops } from "./components/shopItem";
import Loading from "./components/Loading";
import ShopList from "./components/ShopList";

export default function ShopPage() {

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