/*{ 
        return (
          <>
            <div className=" bg-yellow-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border border-gray-300 rounded-lg p-4">
                <div className="text-white bg-green-500 border border-default hover:bg-neutral-secondary-medium 
                        hover:text-heading focus:ring-3 focus:ring-neutral-tertiary-soft font-medium 
                        leading-5 rounded-full text-sm px-4 py-2 focus:outline-none">รายการสมุนไพรในระบบ</div>
                </div>
    
                <div className="flex justify-center gap-3 space-y-3 flex justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tmpTdl}
                </div>
    
                                <Modal open={open} onClose={()=>setOpen(false)}>
                    { selectedHerb && (
                        <div>
                            <h2 className="text-xl font-bold text-blue-700">{selectedHerb.name}</h2>
                            <p className="mt-2 text-sm text-blue-700">{selectedHerb.detail}</p>
                            <p className="mt-2 text-sm text-blue-700">{selectedHerb.type} / {selectedHerb.suplier}</p>
                            <p className="mt-2 text-sm text-blue-700">{selectedHerb.status ? "Completed": "sold"}</p>
                        </div>
                    )}
                </Modal>
    
                <Footer />
          </>
        );
    } */