import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Flame, Globe, Utensils, Coffee, 
    ChevronLeft, ChevronRight, Plus, Minus, 
    Trash2, ShoppingBag, X, ChefHat, User, LogOut, LogIn
} from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

//const API_URL = "http://localhost:5000";
const API_URL = "https://desimakingvedesi-backend.onrender.com"; // Keep this for later when deploying
// --- 1. DATA CONSTANTS ---
const PLATTERS = [
    { id: '3-course', name: '3-Course Platter', title: 'Subtle Indulgence', desc: 'Refined, light, and fulfilling.', slots: 3, price: 350, image: "/platters/3-course.png" },
    { id: '4-course', name: '4-Course Platter', title: 'Harmonious Balance', desc: 'A perfect symmetry of flavors.', slots: 4, price: 450, image: "/platters/4-course.jpg" },
    { id: '5-course', name: '5-Course Platter', title: 'Elevated Experience', desc: 'For the true connoisseur.', slots: 5, price: 550, image: "/platters/5-course.jpg" },
    { id: '6-course', name: '6-Course Platter', title: 'Grand Expression', desc: 'The ultimate royal feast.', slots: 6, price: 650, image: "/platters/6-course.jpg" },
];

const pageVariants = { initial: { opacity: 0, y: 10 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -10 } };

// --- 2. SUB-COMPONENTS (MOVED OUTSIDE TO STOP FLICKERING) ---

const Navbar = ({ user, mode, setMode, setStep, searchQuery, setSearchQuery, onLogout, navigate }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row gap-4 md:items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setMode('home'); setStep(0); }}>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl">D</div>
                <div>
                    <h1 className="font-bold text-xl text-slate-800 tracking-tight leading-none">Desi Making Vedesi</h1>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Premium Dining</p>
                </div>
            </div>

            {mode === 'home' && (
                <div className="flex-1 max-w-lg mx-auto w-full relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-100 border-none rounded-full py-3 pl-10 pr-4 outline-none font-medium text-slate-700" />
                </div>
            )}

            <div className="relative shrink-0">
                {user ? (
                    <>
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1.5 pr-4 rounded-full hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95">
                            <img src={user.photoURL || "https://placehold.co/100"} className="w-9 h-9 rounded-full border border-white shadow-sm" />
                            <span className="text-xs font-bold text-slate-700 hidden md:block">My Profile</span>
                        </button>
                        <AnimatePresence>
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}/>
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden">
                                        <div className="p-4 border-b border-slate-50">
                                            <p className="text-sm font-bold text-slate-800 truncate">{user.displayName}</p>
                                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                        </div>
                                        <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"><User size={16}/> Profile</button>
                                        <button onClick={onLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"><LogOut size={16}/> Logout</button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </>
                ) : (
                    // Using a dedicated login button that triggers the modal prop passed down would be cleaner, 
                    // but for now we will rely on the parent checking auth when they try to order.
                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                        Guest Mode
                    </div>
                )}
            </div>
        </header>
    );
};

const HomeView = ({ menu, addToCart, searchQuery, setMode, setStep, cart, setIsCartOpen }) => {
    const filteredMenu = menu.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return (
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="flex flex-col gap-8 pb-32">
            <div className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="relative z-10 max-w-2xl">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Signature Experience</span>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Make Your Own <br/> Signature Combo</h1>
                    <button onClick={() => { setMode('builder'); setStep(0); }} className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl mt-4 flex items-center gap-2 hover:scale-105 transition-transform">Start Building <ChevronRight /></button>
                </div>
                <ChefHat className="absolute -right-10 -bottom-10 text-white/10 w-64 h-64 rotate-12" />
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Standard Menu</h2>
                {cart.length > 0 && (
                    <button onClick={() => setIsCartOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 animate-bounce-short">
                        <ShoppingBag size={16}/> View Cart ({cart.reduce((a,b)=>a+b.quantity,0)})
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenu.map(item => (
                    <div key={item._id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-all">
                        <img src={item.image ? `${API_URL}${item.image}` : "https://placehold.co/100"} className="w-24 h-24 rounded-2xl object-cover bg-slate-100" />
                        <div className="flex-1 flex flex-col justify-between">
                            <div><h3 className="font-bold text-slate-800">{item.name}</h3><p className="text-xs text-slate-400 line-clamp-2">{item.description}</p></div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-bold text-emerald-600">₹{item.price}</span>
                                <button onClick={() => addToCart(item)} className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-transform"><Plus size={16}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const PlatterSelect = ({ setCombo, setStep, setMode }) => (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants}>
        <button onClick={() => setMode('home')} className="mb-4 flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-emerald-600"><ChevronLeft size={16}/> Back to Home</button>
        <div className="w-full h-64 rounded-3xl overflow-hidden mb-8 shadow-xl relative group">
            <img src="/platters/header-tray.jpg" alt="Hero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Choose Your Canvas</h2>
                <p className="text-emerald-100 font-medium">Select a platter size to begin.</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLATTERS.map(p => (
                <div key={p.id} onClick={() => { setCombo({ platter: p, tray: {} }); setStep(1); }} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all cursor-pointer group active:scale-[0.98]">
                    <div className="h-48 bg-slate-900 overflow-hidden relative flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-2"><span className="text-slate-800 font-bold">{p.name}</span><span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">₹{p.price}</span></div>
                        <p className="text-sm text-slate-400">{p.desc}</p>
                         <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {p.slots} Compartments</div>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

const TrayBuilder = ({ menu, combo, setCombo, setStep }) => {
    const [dragSearch, setDragSearch] = useState("");
    const filteredItems = menu.filter(i => i.name.toLowerCase().includes(dragSearch.toLowerCase()));

    const handleDragStart = (e, item) => { e.dataTransfer.setData("item", JSON.stringify(item)); };
    const handleDrop = (e, slotId) => {
        e.preventDefault();
        const itemData = e.dataTransfer.getData("item");
        if (itemData) {
            const item = JSON.parse(itemData);
            setCombo(prev => ({ ...prev, tray: { ...prev.tray, [slotId]: item } }));
        }
    };

    const Slot = ({ id, label, className }) => {
        const item = combo.tray[id];
        return (
            <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, id)} className={`relative rounded-2xl border border-gray-700/50 shadow-inner flex flex-col items-center justify-center overflow-hidden transition-all ${className} ${item ? 'bg-white' : 'bg-gray-800/80 hover:bg-gray-700'}`}>
                {item ? (
                    <div className="text-center animate-pop-in p-2">
                            <img src={item.image ? `${API_URL}${item.image}` : "https://placehold.co/100"} className="w-12 h-12 rounded-full object-cover mx-auto mb-1 border-2 border-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-800 leading-tight block">{item.name}</span>
                        <button onClick={(e) => { e.stopPropagation(); setCombo(p => ({...p, tray: {...p.tray, [id]: null}})) }} className="absolute top-1 right-1 bg-red-100 text-red-500 rounded-full p-1"><Trash2 size={10}/></button>
                    </div>
                ) : (
                    <div className="text-center pointer-events-none opacity-50">
                        <Plus size={16} className="text-gray-500 mx-auto mb-1 opacity-50" />
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                    </div>
                )}
            </div>
        );
    };

    const renderGrid = () => {
        const slots = combo.platter.slots;
        if (slots === 3) return (<div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-3"><Slot id="slot2" label="Side" /><Slot id="slot3" label="Staple" /><Slot id="slot1" label="Main Course" className="col-span-2" /></div>);
        if (slots === 4) return (<div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-2 p-3"><Slot id="slot2" label="Side" /><Slot id="slot3" label="Staple" /><Slot id="slot4" label="Sweet" /><Slot id="slot1" label="Main Course" className="col-span-3" /></div>);
        if (slots === 5) return (<div className="w-full h-full grid grid-cols-4 grid-rows-2 gap-2 p-3"><Slot id="slot2" label="Side 1" /><Slot id="slot3" label="Side 2" /><Slot id="slot4" label="Staple" /><Slot id="slot5" label="Sweet" /><Slot id="slot1" label="Main Course" className="col-span-4" /></div>);
        if (slots === 6) return (<div className="w-full h-full grid grid-cols-4 grid-rows-2 gap-2 p-3"><Slot id="slot3" label="Side 1" /><Slot id="slot4" label="Side 2" /><Slot id="slot5" label="Rice" /><Slot id="slot6" label="Sweet" /><Slot id="slot1" label="Main Course" className="col-span-3" /><Slot id="slot2" label="Breads" className="col-span-1" /></div>);
    };

    return (
        <div className="flex flex-col md:flex-row h-[85vh] gap-6">
            <div className="w-full md:w-1/3 flex flex-col bg-white rounded-3xl shadow-xl border border-slate-100 order-2 md:order-1 h-full overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-slate-50">
                    <h3 className="font-bold text-slate-700 mb-2">Drag Items to Tray</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input type="text" placeholder="Search menu..." className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={dragSearch} onChange={e => setDragSearch(e.target.value)} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredItems.map(item => (
                        <div key={item._id} draggable onDragStart={(e) => handleDragStart(e, item)} className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-emerald-400 cursor-grab active:cursor-grabbing hover:bg-slate-50 transition-colors">
                            <img src={item.image ? `${API_URL}${item.image}` : "https://placehold.co/100"} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                            <div><h4 className="font-bold text-slate-800 text-sm">{item.name}</h4><span className="text-[10px] text-slate-400 uppercase font-bold">{item.category}</span></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full md:w-2/3 flex flex-col order-1 md:order-2">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setStep(0)} className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-emerald-600"><ChevronLeft size={16}/> Change Platter</button>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Total: ₹{combo.platter.price}</span>
                </div>
                <div className="flex-grow flex justify-center items-center bg-slate-100 rounded-[2.5rem] relative overflow-hidden">
                    <div className="bg-gray-900 w-full max-w-lg aspect-[4/3] rounded-[2rem] shadow-2xl border-4 border-gray-800 relative">
                            <div className="absolute top-0 left-10 right-10 h-20 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-b-3xl" />
                        {renderGrid()}
                    </div>
                </div>
                <button onClick={() => setStep(2)} className="mt-6 w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg">Review & Pay</button>
            </div>
        </div>
    );
};

const OrderReview = ({ combo, setStep, checkAuthAndOrder }) => (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="max-w-md mx-auto mt-10">
        <button onClick={() => setStep(1)} className="mb-4 text-slate-400 font-bold text-sm hover:text-emerald-600">← Edit Tray</button>
        <h2 className="text-2xl font-bold mb-6">Review Order</h2>
        <div className="bg-white border p-6 rounded-3xl shadow-lg mb-6">
            <h3 className="font-bold text-emerald-600 text-lg">{combo.platter.name}</h3>
                <div className="space-y-2 text-sm font-bold text-slate-700">
                {Object.values(combo.tray).map((item, i) => item && (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                            <span className="text-xs">✅</span> {item.name}
                    </div>
                ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between text-xl font-bold"><span>Total</span><span>₹{combo.platter.price}</span></div>
        </div>
        <button onClick={() => checkAuthAndOrder('combo')} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg">Proceed to Payment</button>
    </motion.div>
);

// --- 3. MAIN APP CONTROLLER ---
export default function CustomerApp({ user, onLogout }) {
    const navigate = useNavigate();
    
    // Global State
    const [mode, setMode] = useState('home'); 
    const [step, setStep] = useState(0); 
    const [searchQuery, setSearchQuery] = useState("");
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [combo, setCombo] = useState({ platter: null, tray: {} });
    
    // UI State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        axios.get(`${API_URL}/api/menu`)
            .then(res => setMenu(res.data))
            .catch(err => console.error("Menu Error", err));
    }, []);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i._id === item._id);
            if (existing) return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (itemId, change) => {
        setCart(prev => prev.map(item => {
            if (item._id === itemId) return { ...item, quantity: Math.max(0, item.quantity + change) };
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleLogin = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            setShowLoginModal(false);
        } catch (error) {
            console.error("Login Failed", error);
        }
    };

    const checkAuthAndOrder = (orderType) => {
        if (!user) {
            setIsCartOpen(false); // Close cart so modal is visible
            setShowLoginModal(true); // Show Login Modal
        } else {
            placeOrder(orderType);
        }
    };

    const placeOrder = async (orderType) => {
        try {
            // ... Order Logic ...
            alert("Order Placed Successfully!");
            setMode('home');
            setStep(0);
            setCart([]);
            setIsCartOpen(false);
        } catch (err) {
            alert("Failed to place order.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Navbar 
                user={user} 
                mode={mode} 
                setMode={setMode} 
                setStep={setStep} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                onLogout={onLogout}
                navigate={navigate}
            />

            {/* LOGIN MODAL - Z-INDEX 60 to cover everything */}
            <AnimatePresence>
                {showLoginModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowLoginModal(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Login Required</h2>
                            <p className="text-slate-500 text-sm mb-6">Please login to place your order and track delivery.</p>
                            <button onClick={handleLogin} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                                <LogIn size={18}/> Login with Google
                            </button>
                            <button onClick={() => setShowLoginModal(false)} className="mt-4 text-slate-400 text-sm font-bold hover:text-slate-600">Cancel</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CART DRAWER */}
            <AnimatePresence>
                {isCartOpen && (
                    <div className="fixed inset-0 z-50 flex justify-center items-end bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}>
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} onClick={e => e.stopPropagation()} className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Your Order</h2>
                                <button onClick={() => setIsCartOpen(false)} className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"><X size={16}/></button>
                            </div>
                            <div className="max-h-[40vh] overflow-y-auto space-y-4 mb-6">
                                {cart.map(item => (
                                    <div key={item._id} className="flex justify-between items-center border-b border-gray-50 pb-4">
                                        <div><h4 className="font-bold text-gray-800">{item.name}</h4><p className="text-sm text-gray-500">₹{item.price * item.quantity}</p></div>
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                                            <button onClick={() => updateQuantity(item._id, -1)} className="text-gray-400 px-2"><Minus size={14}/></button>
                                            <span className="font-bold text-sm">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, 1)} className="text-emerald-600 px-2"><Plus size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => checkAuthAndOrder('standard')} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg">Pay ₹{cartTotal} & Order</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <main className="p-4 md:p-6 max-w-7xl mx-auto h-full">
                <AnimatePresence mode="wait">
                    {mode === 'home' && (
                        <HomeView 
                            key="home" 
                            menu={menu} 
                            addToCart={addToCart} 
                            searchQuery={searchQuery} 
                            setMode={setMode} 
                            setStep={setStep} 
                            cart={cart}
                            setIsCartOpen={setIsCartOpen}
                        />
                    )}
                    {mode === 'builder' && (
                        <div className="h-full">
                            {step === 0 && <PlatterSelect key="platter" setCombo={setCombo} setStep={setStep} setMode={setMode} />}
                            {step === 1 && <TrayBuilder key="tray" menu={menu} combo={combo} setCombo={setCombo} setStep={setStep} />}
                            {step === 2 && <OrderReview key="review" combo={combo} setStep={setStep} checkAuthAndOrder={checkAuthAndOrder} />}
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}