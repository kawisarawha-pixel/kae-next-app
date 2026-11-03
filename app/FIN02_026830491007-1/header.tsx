import Link from 'next/link';
export default function Header() {
    
    return (
    <header className="bg-blue-400 shadow-md fixed w-full top-0 left-0 z-50">
  <nav className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
    <a href="#" className="text-2xl font-bold text-white">ร้านสมุนไพร</a>

    <div className="hidden md:flex items-center gap-6 text-white">
      <a href="/FIN02_026830491007-1" className="hover:text-white">หน้าแรก</a>
      <Link href="/FIN02_026830491007-1/contact2" className="bg-sky-600 text-white px-4 py-2 rounded-lg">เพิ่มสมุนไพร</Link> 
    </div>
  </nav>
</header>
);

}