export default function Footer() {
    return (
        <footer className="bg-sky-200 text-slate-300 mt-20">
  <div className="max-w-7xl mx-auto px-6 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <span className="text-2xl font-bold text-pink-300">YourLogo</span>
        <p className="mt-4 text-sm text-white">Xxx</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-pink-300 uppercase tracking-wider">Xxx</h4>
        <ul className="mt-4 space-y-2 text-sm">
          <li><a href="#" className="hover:text-white transition">Xxx</a></li>
          <li><a href="#" className="hover:text-white transition">Xxx</a></li>
          <li><a href="#" className="hover:text-white transition">Xxx</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-pink-300 uppercase tracking-wider">Xxx</h4>
        <ul className="mt-4 space-y-2 text-sm">
          <li><a href="#" className="hover:text-white transition">Xxx</a></li>
          <li><a href="#" className="hover:text-white transition">Xxx</a></li>
          <li><a href="#" className="hover:text-white transition">Xxx</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-pink-300 uppercase tracking-wider">Subscribe</h4>
        <p className="mt-4 text-sm text-white">Xxx</p>
        <form className="mt-4 flex max-w-md gap-2">
          <input type="email" required className="w-full rounded-md border-0 bg-slate-800 px-4 py-2 text-sm text-white shadow-sm ring-1 ring-slate-700 focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
          <button type="submit" className="flex-none rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition">Xxx</button>
        </form>
      </div>
    </div>

    <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between">
      <p className="text-xs text-slate-400">&copy; 2026 Your Company, Inc. All rights reserved.</p>
      <div className="flex space-x-6 mt-4 sm:mt-0">
        <a href="#" className="text-slate-400 hover:text-white">Facebook icon</a>
        <a href="#" className="text-slate-400 hover:text-white">Instagram icon</a>
        <a href="#" className="text-slate-400 hover:text-white">Tiktok icon</a>
        <a href="#" className="text-slate-400 hover:text-white">Twitter icon</a>
      </div>
    </div>
  </div>
</footer>
);
}