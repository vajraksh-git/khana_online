import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Flame, Globe, Utensils, Coffee, ChevronLeft, Trash2 } from 'lucide-react';

const MENU_ITEMS = [
    { id: 'm1', name: "Butter Chicken", category: "main", icon: "🍗" },
    { id: 'm2', name: "Paneer Butter Masala", category: "main", icon: "🧀" },
    { id: 'm3', name: "Chicken Chettinad", category: "main", icon: "🌶️" },
    { id: 's1', name: "Dal Makhani", category: "side", icon: "🥣" },
    { id: 's2', name: "Jeera Aloo", category: "side", icon: "🥔" },
    { id: 's3', name: "Gobi 65", category: "side", icon: "🥦" },
    { id: 'st1', name: "Butter Naan", category: "staple", icon: "🫓" },
    { id: 'st2', name: "Jeera Rice", category: "staple", icon: "🍚" },
    { id: 'd1', name: "Gulab Jamun", category: "dessert", icon: "🍡" },
];

export default function TrayBuilder({ combo, setCombo, onNext, onBack }) {
    const [search, setSearch] = useState("");
    const [draggedItem, setDraggedItem] = useState(null);

    // Filter items based on search
    const filteredItems = MENU_ITEMS.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    // --- DRAG HANDLERS ---
    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.dataTransfer.setData("text/plain", JSON.stringify(item));
        e.dataTransfer.effectAllowed = "copy";
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = "copy";
    };

    const handleDrop = (e, slotId) => {
        e.preventDefault();
        const itemData = e.dataTransfer.getData("text/plain");
        if (itemData) {
            const item = JSON.parse(itemData);
            setCombo(prev => ({
                ...prev,
                tray: { ...prev.tray, [slotId]: item }
            }));
        }
        setDraggedItem(null);
    };

    // --- RENDER SLOT (DROP ZONE) ---
    const Slot = ({ id, label, className }) => {
        const item = combo.tray[id];
        
        return (
            <div 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, id)}
                className={`
                    relative rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center
                    ${className}
                    ${item ? 'bg-white border-transparent shadow-lg' : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-emerald-500'}
                `}
            >
                {item ? (
                    <div className="text-center animate-pop-in">
                        <span className="text-3xl block mb-1">{item.icon}</span>
                        <span className="text-[10px] font-bold text-slate-800 leading-tight block px-2">{item.name}</span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setCombo(p => ({...p, tray: {...p.tray, [id]: null}})) }}
                            className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 hover:bg-red-200"
                        >
                            <Trash2 size={12}/>
                        </button>
                    </div>
                ) : (
                    <div className="text-center pointer-events-none opacity-50">
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">{label}</p>
                        <p className="text-[9px] text-emerald-400">Drop Here</p>
                    </div>
                )}
            </div>
        );
    };

    // --- RENDER TRAY GRID (Based on Platter Size) ---
    const renderTrayGrid = () => {
        const slots = combo.platter.slots;
        // Simple mapping for demo (expand logic as needed for 4,5,6 slots)
        if (slots === 3) {
            return (
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-3 p-4">
                    <Slot id="slot1" label="Main Dish" className="col-span-2 row-span-1" />
                    <Slot id="slot2" label="Side" />
                    <Slot id="slot3" label="Staple" />
                </div>
            );
        }
        // Default 4-Slot (2x2)
        return (
            <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-3 p-4">
                <Slot id="slot1" label="Main Dish" />
                <Slot id="slot2" label="Bread/Rice" />
                <Slot id="slot3" label="Side 1" />
                <Slot id="slot4" label="Side 2" />
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row h-[85vh] gap-6">
            
            {/* 1. LEFT SIDE: DRAGGABLE MENU (Searchable) */}
            <div className="w-full md:w-1/3 flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden order-2 md:order-1 border border-slate-100">
                <div className="p-4 border-b border-gray-100 bg-slate-50">
                    <h3 className="font-bold text-slate-700 mb-3">Drag Items to Tray</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                            type="text" 
                            placeholder="Search Paneer, Chicken..." 
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredItems.map(item => (
                        <div 
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-400 cursor-grab active:cursor-grabbing transition-all"
                        >
                            <span className="text-2xl bg-slate-50 w-10 h-10 flex items-center justify-center rounded-lg">{item.icon}</span>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">{item.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. RIGHT SIDE: THE TRAY (Drop Zone) */}
            <div className="w-full md:w-2/3 flex flex-col order-1 md:order-2">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-emerald-600"><ChevronLeft size={16}/> Change Platter</button>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Total: ₹{combo.platter.price}</span>
                </div>

                <div className="flex-grow flex justify-center items-center bg-slate-100 rounded-[2.5rem] relative overflow-hidden">
                    {/* The Black Tray */}
                    <div className="bg-gray-900 w-full max-w-md aspect-[4/3] rounded-[2rem] shadow-2xl border-4 border-gray-800 relative">
                        {renderTrayGrid()}
                    </div>
                </div>

                <button 
                    onClick={onNext}
                    className="mt-6 w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-transform active:scale-95"
                >
                    Review & Pay
                </button>
            </div>
        </div>
    );
}