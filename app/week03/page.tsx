import Header from "../components/header";
import Footer from "../components/footer";
import { toDoList } from "../data/toDoList";

export default function ToDoList() {

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

    const tmpTdl = toDoList.map(item =>
        <div className="w-full max-w-sm p-6 bg-purple-300 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <h3 className="text-lg font-semibold text-pink-400">{item.title}</h3>
    <p className="mt-2 text-sm text-white">{item.desc}</p>
    <p className="mt-2 text-sm text-white">{item.data_added}</p>
    <p className="mt-2 text-sm text-white">{item.author}</p>
    </div>
    )
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

            <div className="flex justify-center gap-3">
                {tmpTdl}
            </div>

            <Footer />
      </>
    );
}