"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import { dataItem, appendItem } from "../data/dataItem";
import { useState } from "react";
import ToDoForm from "./components/ToDoForm";
import Modal from "./components/Modal";

export default function ToDoList() {

    const toDoList = [...dataItem, ...appendItem];
    const [tasks, setTasks] = useState(toDoList);
    const [numOfTasks, setNoft] = useState(tasks.length);
    const [status, setStatus] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null);

    const resetEditTask = () => setEditingTask(null);

    const filteredTasks = 
        status == null ? tasks
        : tasks.filter(
            (item) => item.status == status
    );

    let name = "Kawisara Whangmana";
    const major = "เทคโนโลยีสารสนเทศ (Information Technology)";
    let classYear = 2;
    let classSec = "ทส.ท./ทส.ต.";
    let active = true;
    // Arrow functions
    const isActive = (act: boolean) => {
        if(act)
            return <span style={{ color: "green"}}>กำลังศึกษาอยู่</span>;
        return <span style={{ color: "red"}}>ไม่ได้เป็นนักศึกษาแล้ว</span>;
    }

    const Status = (status: boolean) => {
        if(status)
            return <span style={{ color: "green" }}>เสร็จสิ้น</span>
        return <span style={{ color: "red"}}>กำลังดำเนินการ</span>
    }

    const onEdit = (t) => {
        //alert(`งานที่คุณต้องการแก้ไข ${t}`);
        setEditingTask(t);
    }

        const updateTask = (id, title, status) => {
            setTasks(
                tasks => tasks.map(
                    t => t.id === id ?
                    {
                        ...t,
                        title: title,
                        status: status
                    } : t
                ));
                setEditingTask(null);
        }

    const onDelete = (id) => {
        //alert(`คุณต้องการลบข้อมูล รหัสงาน ${id}?`);
        const updateTasks = tasks.filter(
            item => item.id != id
        );
        setTasks(updateTasks);
    }

    const tmpTdl = filteredTasks.map((item, index) => {
        const {id, title, desc, data_added, author, status} = item;
        return (<div className="w-full max-w-sm p-6 bg-purple-300 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200" key={index}>
            <h3 className="text-lg font-semibold text-pink-400">{title}</h3>
            <p className="mt-2 text-sm text-white">{desc}</p>
            <p className="mt-2 text-sm text-white">{author} / {data_added}</p>
            <p className="mt-2 text-sm text-white">{Status(status)}</p>

            <div className="flex gap-2 mt-2">
                {/* View */}
                <button onClick={(e) => {setSelectedTask(item);setOpen(true);}} className="bg-green-500 text-white px-3 py-1 rounded">View</button>
                {/*<button onClick={(e)=>setOpen(true)} className="bg-green-500 text-white px-3 py-1 rounded">View</button>*/}

                {/* Edit */}
                <button onClick={(e)=>onEdit(item)} className="bg-orange-500 text-white px-3 py-1 rounded">Edit</button>

                {/* Delete */}
                <button onClick={(e)=>onDelete(id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
        </div>);
    
    });

    const addTask = (title, status) => {
        const newTask = {
        id: tasks.length+1,
        title: title,
        desc: "รายละเอียดของงานที่เพิ่ม",
        data_added: "17/08/2569",
        author: "Kawisara",
        status: status
        };

        setTasks([...tasks, newTask]);
        setNoft(tasks.length+1);
    }

    // const isActive = (act: boolean) => (act) ? "กำลังศึกษาอยู่" : "ไม่ได้เป็นนักศึกษาแล้วนะ";
    console.log(`Name: ${name}`);
    console.log(`Major: ${major}`);

    return (
      <>
            <Header />
            <div className="flex justify-center mt-30 mb-20">
            <div className="w-full max-w-sm p-6 bg-purple-300 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading text-center text-pink-400 leading-8">To Do List</h5>
            <p className="text-sm text-white dark:text-blue-400 font-medium">
                ชื่อ-สกุล: {name}
                สาขาวิชา: {major}
                ห้อง: {classSec} / {classYear}
                สถานะภาพนักศึกษา: {isActive(active)}
            </p>
            </div>
        </div>

        <ToDoForm 
            addTask={addTask}
            editingTask={editingTask}
            updateTask={updateTask}
            resetEditingTask={setEditingTask}
        />

        <div className=" bg-yellow-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border border-gray-300 rounded-lg p-4">
            <div className="text-white bg-pink-300 border border-default hover:bg-neutral-secondary-medium 
                    hover:text-heading focus:ring-3 focus:ring-neutral-tertiary-soft font-medium 
                    leading-5 rounded-full text-sm px-4 py-2 focus:outline-none">งานที่ต้องทำ {numOfTasks} รายการ</div>
            {/*<div>
                <button type="button" className="text-white bg-indigo-300 border border-default hover:bg-neutral-secondary-medium 
                    hover:text-heading focus:ring-3 focus:ring-neutral-tertiary-soft font-medium 
                    leading-5 rounded-full text-sm px-4 py-2 focus:outline-none" onClick={addTask}>เพิ่มงาน</button>
            </div>*/}

            <div className="inline-flex gap-2" role="group">
                <button type="button" className="text-white bg-blue-600 border border-default hover:bg-neutral-secondary-medium 
                    hover:text-heading focus:ring-3 focus:ring-neutral-tertiary-soft font-medium 
                    leading-5 rounded-full text-sm px-4 py-2 focus:outline-none" onClick={() => setStatus(null)} >[A] All</button>
                <button type="button" className="text-white bg-green-500 border border-default hover:bg-neutral-secondary-medium 
                    hover:text-heading focus:ring-3 focus:ring-neutral-tertiary-soft font-medium 
                    leading-5 rounded-full text-sm px-4 py-2 focus:outline-none" onClick={() => setStatus(true)}>[C] Completed</button>
                <button type="button" className="text-white bg-orange-400 border border-default hover:bg-neutral-secondary-medium 
                    hover:text-heading focus:ring-3 focus:ring-neutral-tertiary-soft font-medium 
                    leading-5 rounded-full text-sm px-4 py-2 focus:outline-none" onClick={() => setStatus(false)}>[P] Pending</button>
                </div>
            </div>

            <div className="flex justify-center gap-3 space-y-3 flex justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tmpTdl}
            </div>

                            <Modal open={open} onClose={()=>setOpen(false)}>
                { selectedTask && (
                    <div>
                        <h2 className="text-xl font-bold text-blue-700">{selectedTask.title}</h2>
                        <p className="mt-2 text-sm text-blue-700">{selectedTask.desc}</p>
                        <p className="mt-2 text-sm text-blue-700">{selectedTask.author} / {selectedTask.data_added}</p>
                        <p className="mt-2 text-sm text-blue-700">{selectedTask.status ? "Completed": "Pending"}</p>
                    </div>
                )}
            </Modal>

            <Footer />
      </>
    );
}