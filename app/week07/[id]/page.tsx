import Link from "next/link";
// import { shops } from "../components/shopItem";
import Loading from "../components/Loading";
import { Suspense } from "react";

export default async function ShopDetail({ params }) {
    const { id } = await params;

    let shops = {};
    try {
        const resData = await fetch(`http://localhost:8009/api/shops/${id}`);
        if(!resData.ok){
            throw new Error(`Network response was not ok.`);
        }
        shops = await resData.json();
        console.log(`Detail:${shops}`);
        } catch(error) {
            console.log(`Error fetching data: ${error}`);
        }

    const Status = (status: boolean) => {
        if(status)
            return <span style={{ color: "green" }}>open</span>
        return <span style={{ color: "red"}}>closed</span>
    }

    return (
        <>
            <Suspense fallback={<Loading />}>
                 <div className="w-xl mx-auto p-6">
                    <h1 className="text-3xl font-bold">
                    Shop Detail
                    </h1>

                <div key={shops.shopId} className="border rounded-lg p-4 m-4">
                    <p className="mt-4 font-semibold">
                        ID: {shops.shopId}
                    </p>
                    <p className="my-4">
                        Name: {shops.shopName}
                    </p>
                    <p className="my-4">
                        Type: {shops.shopType}
                    </p>
                    <p className="my-4">
                        Loc: {shops.shopLoc?.lat}, {shops.shopLoc?.lon}
                    </p>
                    <p className="my-4">
                        Open Status: {Status(shops.shopStatus)}
                    </p>
                </div>

            <Link href="/week07" className="bg-gray- text-white px-4 py-2 rounded">
            Back600
            </Link>


    </div>
            </Suspense>
        </>
    );
}
    // const shop = shops.find(
    //     item => item.id === Number(id)
    // );
    // const [shop, setShop] = useState({});
    // useEffect(() => {
    //     const fetchData = async() => {
    //         try {
    //             const resData = await fetch(`http://localhost:8009/${id}`);
    //             if(resData.ok){
    //                 const resShop = await resData.json();
    //                 setShop(resShop);
    //             } else {
    //                 throw new Error(`Network response was not ok.`);
    //             }
    //         } catch(error) {
    //             console.log(`Error fetching data: ${error}`);
    //         }
    //     }
    //     fetchData();
    // },[shop]);