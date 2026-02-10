import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const PLATTERS = [
    { id: '3-course', name: '3-Course Platter', title: 'Subtle Indulgence', desc: 'Refined, light, and fulfilling.', slots: 3, price: 350, image: "/platters/3-course.png" },
    { id: '4-course', name: '4-Course Platter', title: 'Harmonious Balance', desc: 'A perfect symmetry of flavors.', slots: 4, price: 450, image: "/platters/4-course.jpg" },
    { id: '5-course', name: '5-Course Platter', title: 'Elevated Experience', desc: 'For the true connoisseur.', slots: 5, price: 550, image: "/platters/5-course.jpg" },
    { id: '6-course', name: '6-Course Platter', title: 'Grand Expression', desc: 'The ultimate royal feast.', slots: 6, price: 650, image: "/platters/6-course.jpg" },
];

export default function PlatterSelect({ onSelect, onBack }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={onBack} className="mb-4 flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-emerald-600"><ChevronLeft size={16}/> Back to Home</button>
            
            {/* 1. THE GENERATED HERO IMAGE */}
            <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-8 shadow-xl relative group">
                {/* ⚠️ Make sure to save the generated image as 'header-tray.jpg' in public/platters/ */}
                <img src="/platters/header-tray.png" alt="Premium Trays" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Choose Your Canvas</h2>
                    <p className="text-emerald-100 font-medium">Select a platter size to begin curating your meal.</p>
                </div>
            </div>

            {/* 2. THE 4 PLATTER OPTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PLATTERS.map(p => (
                    <div 
                        key={p.id} 
                        onClick={() => onSelect(p)} 
                        className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all cursor-pointer group active:scale-[0.98]"
                    >
                        <div className="h-48 bg-slate-900 overflow-hidden relative flex items-center justify-center">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-800 font-bold">{p.name}</span>
                                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">₹{p.price}</span>
                            </div>
                            <p className="text-sm text-slate-400">{p.desc}</p>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {p.slots} Compartments
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}