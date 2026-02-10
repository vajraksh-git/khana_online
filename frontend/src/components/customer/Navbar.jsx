import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <--- 1. Import this

export default function Navbar({ user, setMode, searchQuery, setSearchQuery }) {
    const navigate = useNavigate(); // <--- 2. Initialize Hook

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row gap-4 md:items-center justify-between shadow-sm">
            {/* LOGO */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setMode('home')}>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl">D</div>
                <div>
                    <h1 className="font-bold text-xl text-slate-800 tracking-tight leading-none">Desi Making Vedesi</h1>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Premium Dining</p>
                </div>
            </div>

            {/* SEARCH */}
            <div className="flex-1 max-w-lg mx-auto w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search for dishes..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-100 border-none rounded-full py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700 transition-all"
                />
            </div>

            {/* PROFILE (Fixed) */}
            <div className="flex items-center gap-3 shrink-0">
                <div 
                    onClick={() => navigate('/profile')} // <--- 3. CLICK EVENT ADDED
                    className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1.5 pr-4 rounded-full cursor-pointer hover:bg-slate-100 transition-colors group active:scale-95"
                >
                    <img src={user.photoURL || "https://placehold.co/100"} className="w-9 h-9 rounded-full border border-white shadow-sm" />
                    <div className="hidden md:block">
                        <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">My Profile</p>
                    </div>
                </div>
            </div>
        </header>
    );
}