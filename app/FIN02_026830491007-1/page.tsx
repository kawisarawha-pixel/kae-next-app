"use client";

import Header from "./header";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const MyHerbList = () => {
                  const router = useRouter();
                  return (
                    <button
                      onClick={() => router.push("/FIN02_026830491007-1/contact2")}     
                        className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-md hover:bg-pink-50 transition"
                        >
                      + เพิ่มข้อมูลสมุนไพร
                    </button>
                  );
                }
  return (
    <>
      <Header />

      <main className="min-h-screen bg-blue-50/50 dark:bg-slate-900 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header */}
          <section className="bg-gradient-to-r from-blue-400 to-sky-300 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                สมุนไพรไทยจากพื้นเมือง
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                ร้านสมุนไพร
              </h1>
              <p className="text-pink-100 max-w-xl text-sm md:text-base leading-relaxed">
                คัดสรรสมุนไพรคุณภาพดีจากผู้เชี่ยวชาญด้านสมุนไพรไทย เพื่อสุขภาพและความงามของคุณ
              </p>
              <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
                {MyHerbList()}
              </div>
            </div>
          </section>

          {/* ติดต่อ */}
          <section className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                ติดต่อ
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                ต้องการสอบถามข้อมูลเพิ่มเติม
              </p>
            </div>

            {/* Profile */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden">
              <div className="h-28 bg-gradient-to-r from-blue-400 to-sky-300"></div>

              <div className="relative flex flex-col items-center px-6 pb-8 text-center">
                {/* รูป */}
                <div className="-mt-14 mb-4">
                  <img
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md object-cover"
                    src="/images/S__104415234.jpg"
                    alt="Kae Profile"
                  />
                </div>

                {/* ชื่อ */}
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  Kawisara Whangmana
                </h3>
                <p className="text-xs text-blue-600 dark:text-pink-400 font-medium mt-0.5">
                  ผู้ดูแลระบบ
                </p>

                {/* รายละเอียด */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                  กำลังศึกษาอยู่ที่มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก วิทยาเขตเขตจักรพงษภูวนารถ คณะบริหารธุรกิจและเทคโนโลยีสารสนเทศ สาขาเทคโนโลยีสารสนเทศ ชั้นปีที่ 2
                </p>

                {/* ปุ่มติดต่อ */}
                <div className="mt-5 flex items-center justify-center gap-3 w-full">
                  <a
                    href="mailto:Kawisara.Wha@rmutto.ac.th"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-md hover:bg-sky-600 transition"
                  >
                    E-mail
                  </a>
                  <a
                    href="https://github.com/kawisarawha-pixel/kae-next-app.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 border border-slate-300 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-pink-50 dark:hover:bg-slate-700 transition"
                  >
                    Github
                  </a>
                </div>

                {/* Social Icon (TikTok) */}
                <div className="mt-5 flex justify-center">
                  <a
                    href="https://www.instagram.com/desu.yi?obrf=YnpoYW14bHp6cGxs&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition transform hover:scale-110"
                  >
                    <img
                      className="w-9 h-9 rounded-full shadow-md object-cover"
                      src="/images/Instagram_icon.png"
                      alt="Instagram logo"
                    />
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}