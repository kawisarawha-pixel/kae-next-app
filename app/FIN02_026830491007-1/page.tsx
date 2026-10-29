"use client";

import Header from "./components/HeaderFinal";
import Footer from "./components/FooterFinal";
import { useState } from "react";
import ToDoForm from "./components/TodoFinal";
import Modal from "./components/ModalFinal";
import { herbForm } from "./MyHerb/MyHerbForm";
export default function ToDoList() {

    const Todo = [...herbForm];
    const [herbs, setHerbs] = useState(Todo);
    const [numOfTasks, setNoft] = useState(herbs.length);
    const [status, setStatus] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedHerb, setSelectedHerb] = useState(null);
    const [editingHerb, setEditingHerb] = useState(null);

    const resetEditHerbs = () => setEditingHerb(null);

    const filteredHerbs = 
        status == null ? herbs
        : herbs.filter(
            (item) => item.status == status
    );
    // Arrow functions
    const isActive = (act: boolean) => {
        if(act)
            return <span style={{ color: "green"}}>พบข้อมูลสมุนไพร</span>;
        return <span style={{ color: "red"}}>ไม่พบข้อมูลสมุนไพร</span>;
    }

    const Status = (status: boolean) => {
        if(status)
            return <span style={{ color: "green" }}>คงเหลือ</span>
        return <span style={{ color: "red"}}>หมดสต๊อก</span>
    }

    const onEdit = (t) => {
        //alert(`งานที่คุณต้องการแก้ไข ${t}`);
        setEditingHerb(t);
    }

        const updateHerb = (id, name, status) => {
            setHerbs(
                herbs => herbs.map(
                    t => t.id === id ?
                    {
                        ...t,
                        name: name,
                        status: status
                    } : t
                ));
                setEditingHerb(null);
        }

    const onDelete = (id) => {
        //alert(`คุณต้องการลบข้อมูล รหัสงาน ${id}?`);
        const updateHerbs = herbs.filter(
            item => item.id != id
        );
        setHerbs(updateHerbs);
    }

    const tmpTdl = filteredHerbs.map((item, index) => {
        const {id, name, detail, idea, type, suplier, contact, status} = item;
        return (<div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200" key={index}>
            <h3 className="text-lg font-semibold text-black">{name}</h3>
            <p className="mt-2 text-sm text-black">{detail}</p>
            <p className="mt-2 text-sm text-black">{idea} / {type}</p>
            <p className="mt-2 text-sm text-black">{suplier} / {contact}</p>
            <p className="mt-2 text-sm text-black">{Status(status)}</p>

            <div className="flex gap-2 mt-2">
                <button onClick={(e)=>onDelete(id)} className="bg-red-500 text-black px-3 py-1 rounded">Delete</button>
            </div>
        </div>);
    
    });

    const addHerb = (name, status) => {
        const newHerb = {
        id: herbs.length+1,
        name: name,
        detail: "รายละเอียดของสมุนไพร",
        type: "ประเภทของสมุนไพร",
        supiler: "ผู้ผลิตสมุนไพร",
        status: status
        };

        setHerbs([...herbs, newHerb]);
        setNoft(herbs.length+1);
    }

    return (
      <>
        <ToDoForm 
            addHerb={addHerb}
            editingHerb={editingHerb}
            updateHerb={updateHerb}
            resetEditingHerb={setEditingHerb}
        />

         <div className=" bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border border-gray-300 rounded-lg p-4">
            <div className="text-black bg-white border border-default hover:bg-neutral-secondary-medium 
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
}