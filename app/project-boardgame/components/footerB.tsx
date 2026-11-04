export default function Footer() {
  return (
    <footer className="bg-blue-400 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <span className="text-2xl font-bold text-amber-200">Thank you</span>
            <p className="text-xs text-white mt-2">
              ขอบคุณที่มาใช้บริการของเรา โอกาสหน้าเชิญใหม่นะคะ :-)
            </p>
          </div>

          {/* ข้อมูลติดต่อ */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-amber-200 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-blue-50">
              <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold text-white">Email:</span>
                <a
                  href="mailto:Kawisara.Wha@rmutto.ac.th"
                  className="hover:underline hover:text-amber-200 transition"
                >
                  Kawisara.Wha@rmutto.ac.th
                </a>
                <span className="hidden sm:inline text-blue-900">|</span>
                <a
                  href="mailto:Aina.Jit@rmutto.ac.th"
                  className="hover:underline hover:text-amber-200 transition"
                >
                  Aina.Jit@rmutto.ac.th
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-white">Phone:</span>
                <span>0645895519 / 0952251657</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ส่วนลิขสิทธิ์ด้านล่าง */}
        <div className="mt-10 border-t border-blue-900 pt-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-blue-200">
            &copy; 2026 Boardgame, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
