"use client";

import { useState } from "react";

export default function ToDoForm( { addTask} ) {

    const [title, setTitle] = useState('');
    const [taskStatus, setTaskStatus] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!title.trim()) return;

        addTask(title, taskStatus);

        handleCancel;

    }

    const handleCancel = (e) => {
        setTitle('');
        setTaskStatus(false);
    }

    return (
    <form onSubmit={handleSubmit}>
      <div className="m-3 p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">เพิ่มข้อมูล</h3>
        <div className="flex">
          <label className="mb-2 text-sm font-medium text-slate-700">รายการที่ต้องทำ:</label>
          <input
            type="text"
            placeholder="Enter task..."
            className="w-11/12 ms-4 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease-content focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <label className="mt-4 py-4 text-sm font-medium text-slate-700">การดำเนินการ:</label>
          <label className="mt-4 px-4 py-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg">
            <input type="radio" name="taskStatus" value='true' checked={taskStatus === true} onChange={(e) => setTaskStatus(e.target.value === 'true')} className="h-4 w-4 accent-blue-600 cursor-pointer" />
            <span className="text-sm font-medium text-gray-700">Completed</span>
          </label>
          <label className="ms-2 mt-4 px-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg">
            <input type="radio" name="taskStatus" value='false' checked={taskStatus === false} onChange={(e) => setTaskStatus(e.target.value === 'true')} className="h-4 w-4 accent-blue-600 cursor-pointer" />
            <span className="text-sm font-medium text-gray-700">Pending</span>
          </label>
        </div>
        <div className="flex mt-4 gap-2 justify-center">
          <button className="bg-blue-600 text-white px-4 py-1 rounded">
            Add new task
          </button>
          <button className="bg-gray-600 text-white px-4 rounded" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
    )
}