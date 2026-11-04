import ShopForm from "../../components/ShopForm";

export default async function EditShopPage({ params, }) {

  const { id } = await params;

  let shop;

  try {

    const resData = await fetch(`http://localhost:8009/api/shops/${id}`);

    if(!resData.ok){
      throw new Error(`Update: Network response was not ok.`);
    }

    // Server response data into JSON


    shop = await resData.json();

  } catch (error) {

    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">
          Shop Not Found
        </h1>
      </div>
    );

  }

  return (

    <main className="min-h-screen bg-slate-200 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Call create and update form component */}
        <ShopForm mode="edit" initialData={shop} />

      </div>
    </main>

  );

}