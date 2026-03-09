export default function Header() {
  return (
    <header className="bg-[#0d1117] text-white border-b border-[#1e2733]">
      <div className="mx-auto px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-sm">Questrade</span>
          <span className="text-slate-500 text-sm">QOffice 2.0</span>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">&#128269;</span>
            <input
              type="text"
              placeholder="Search cases, accounts, users... (⌘K)"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#161b22] border border-[#2d333b] rounded-md text-slate-300 placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-slate-400 hover:text-white text-sm">&#9881;</button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-semibold">
              SH
            </div>
            <span className="text-xs text-slate-300">Sara Huh</span>
          </div>
        </div>
      </div>
    </header>
  );
}
