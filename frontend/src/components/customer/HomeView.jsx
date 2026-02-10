import { motion } from 'framer-motion';
import { ChefHat, ChevronRight, Plus, Utensils } from 'lucide-react';

const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };

export default function HomeView({ setMode, menu, addToCart, searchQuery, API_URL }) {
    const filteredMenu = menu.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="flex flex-col gap-8 pb-32">
            {/* HERO BANNER */}
            <div className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-emerald-100 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="relative z-10 max-w-2xl text-center md:text-left">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Signature Experience</span>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Make Your Own <br/> Signature Combo</h1>
                    <p className="text-emerald-100 text-lg md:text-xl font-medium">Select your platter and curate a meal that defines your taste.</p>
                </div>
                <div className="relative z-10 shrink-0">
                    <button onClick={() => setMode('combo')} className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
                        Start Building <ChevronRight />
                    </button>
                </div>
                <ChefHat className="absolute -left-10 -bottom-10 text-white/5 w-64 h-64 rotate-12" />
            </div>

            {/* STANDARD MENU */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Discover More</h2>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{filteredMenu.length} Items</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMenu.length > 0 ? (
                        filteredMenu.map(item => (
                            <div key={item._id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all flex gap-4">
                                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
                                    <img src={item.image ? `${API_URL}${item.image}` : "https://placehold.co/100"} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{item.name}</h3>
                                        <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-bold text-emerald-600 text-lg">₹{item.price}</span>
                                        <button onClick={() => addToCart(item)} className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors active:scale-90"><Plus size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-10 text-center text-slate-400">
                            <Utensils className="mx-auto mb-2 opacity-50" size={48} />
                            <p>No dishes found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}