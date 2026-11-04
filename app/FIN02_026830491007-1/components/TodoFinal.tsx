"use client";

import { useState, useEffect } from "react";

export default function ToDoForm( { addHerb, editingHerb, updateHerb, resetEditingHerb } ) {

    const [name, setName] = useState('');
    const [suplier, setSuplier] = useState('');
    const [detail, setDetail] = useState('');
    const [images, setImages] = useState('');
    const [idea, setIdea] = useState('');
    const [contact, SetContact] = useState('');
    const [herbStatus, setHerbStatus] = useState(false);

    useEffect(()=>{
        if(editingHerb){
          const { name, status } = editingHerb;
          setName(name);
          setSuplier(suplier);
          setHerbStatus(status);
        }else{
          setName('');
          setHerbStatus(false);
        }   
      }, [editingHerb]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!name.trim()) return;

        if(editingHerb)
          updateHerb(editingHerb.id, name,herbStatus)
        else
          addHerb (name, herbStatus);

        handleCancel;

    }

    const handleCancel = (e) => {
        setName('');
        setHerbStatus(false);
        resetEditingHerb();
    }

    return (
    <form onSubmit={handleSubmit}>
      <div className="m-3 p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">เพิ่มข้อมูลสมุนไพร:</h3>
        <div className="flex">
          <label className="mb-2 text-sm font-medium text-slate-700">ชื่อยาสมุนไพร:</label>
          <input
            type="text"
            placeholder="Enter herb..."
            className="w-11/12 ms-4 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease-content focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          </div>
        <div className="flex">
          <label className="mb-2 text-sm font-medium text-slate-700">รายละเอียด:</label>
          <input
            type="text"
            placeholder="Enter detail..."
            className="w-11/12 ms-4 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease-content focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
            </div>
        <div className="flex">
          <label className="mb-2 text-sm font-medium text-slate-700">ภาพตัวอย่าง:</label>
          <input
            type="images"
            placeholder="select images..."
            className="w-11/12 ms-4 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease-content focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            src="/images"
            onChange={(e) => setImages(e.target.value)}
          />
        </div>
        <div className="flex">
          <label className="mb-2 text-sm font-medium text-slate-700">สรรพคุณ:</label>
          <input
            type="text"
            placeholder="Enter idea..."
            className="w-11/12 ms-4 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease-content focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
        </div>
        <div className="flex">
          <label className="mb-2 text-sm font-medium text-slate-700">ผู้ผลิต:</label>
          <input
            type="text"
            placeholder="Enter suplier..."
            className="w-11/12 ms-4 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease-content focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            value={suplier}
            onChange={(e) => setSuplier(e.target.value)}
          />
        </div>
                <div className="flex">
          <label className="mb-2 text-sm font-medium text-slate-700">ติดต่อผู้ผลิต:</label>
          <input
            type="text"
            placeholder="Enter contact..."
            className="w-11/12 ms-4 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease-content focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            value={contact}
            onChange={(e) => SetContact(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <label className="mt-4 py-4 text-sm font-medium text-slate-700">ประเภทสมุนไพรการนำไปใช้:</label>
          <label className="mt-4 px-4 py-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg">
            <input type="radio" name="herbStatus" value='true' checked={herbStatus === true} onChange={(e) => setHerbStatus(e.target.value === 'true')} className="h-4 w-4 accent-blue-600 cursor-pointer" />
            <span className="text-sm font-medium text-gray-700">ยาใช้ภายใน</span>
          </label>
          <label className="ms-2 mt-4 px-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg">
            <input type="radio" name="herbStatus" value='false' checked={herbStatus === false} onChange={(e) => setHerbStatus(e.target.value === 'true')} className="h-4 w-4 accent-blue-600 cursor-pointer" />
            <span className="text-sm font-medium text-gray-700">ยาใช้ภายนอก</span>
          </label>
          <label className="ms-2 mt-4 px-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg">
            <input type="radio" name="herbStatus" value='false' checked={herbStatus === false} onChange={(e) => setHerbStatus(e.target.value === 'true')} className="h-4 w-4 accent-blue-600 cursor-pointer" />
            <span className="text-sm font-medium text-gray-700">ยาใช้ภายในและภายนอก</span>
          </label>
        </div>
        <div className="flex mt-4 gap-2 justify-center">
          <button className="bg-blue-600 text-white px-4 py-1 rounded">
            { editingHerb ? 'กำลังเพิ่มข้อมูลสมุนไพร' : 'บันทึก'}
          </button>
          <button className="bg-gray-600 text-white px-4 rounded" onClick={handleCancel}>
            เคลียร์
          </button>
        </div>
      </div>
    </form>
    )
}