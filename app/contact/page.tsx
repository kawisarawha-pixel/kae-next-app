import Header from "../components/header";
import Footer from "../components/footer";

export default function Profile() {
    
    return (
        <>
            <Header />
        <div className="max-w-sm mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden mt-20 mb-6">
  <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
 
  <div className="relative flex flex-col items-center px-6 pb-6">
    <div className="-mt-16 mb-4">
      <img className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-md object-cover"
           src="/images/kae.jpeg"
           alt="..." />
    </div>
   
    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Kawisara Whangmana</h3>
    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Student Of Rmutto</p>
    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-3">
        กำลังศึกษาอยู่ที่มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก วิทยาเขตจักรพงษภูวนารถ คณะบริหารธุรกิจและเทคโนโลยีสารสนเทศ สาขาวิชาเทคโนโลยีสารสนเทศ ชั้นปีที่ 2
    </p>

    <div className="mt-6 flex gap-3">
      <a className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      href="mailto:kawisara.wha@rmutto.ac.th"
      target="_blank">
        gmail
      </a>
      <a className="px-5 py-2 border border-slate-300 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
      href="https://github.com/Kawisarawha-pixel/kae-next-app"
      target="_blank">
        github
      </a>
    </div>

    <div className="flex mt-6 space-x-4">
      <a href="#" className="text-slate-400 hover:text-blue-500">
        <img className="w-10 h-10 rounded-full border border-white dark:border-slate-800 shadow-md object-cover"
           src="..."
           alt="..." />
      </a>
      {/* Display the facebook icon or logo. */}
      {/* Display the instagram icon or logo. */}
      {/* Display the github icon or logo. */}
    </div>
  </div>
</div>
<Footer />
</>
    );
}