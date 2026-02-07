import { useState } from 'react';
import Login from './components/Login';
import OrdersView from './components/OrdersView';
import MenuView from './components/MenuView';

const API_URL = "http://localhost:5000";
// const API_URL= "https://desividesi-backend.onrender.com"; // Keep this for later when deploying

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState("orders");

    if (!isAuthenticated) {
        return <Login onLogin={() => setIsAuthenticated(true)} apiUrl={API_URL} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Top Navigation */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl">D</div>
                    <div>
                        <h1 className="font-bold text-lg text-slate-800 leading-none">Kitchen Manager</h1>
                        <p className="text-xs text-emerald-600 font-semibold tracking-wide">LIVE DASHBOARD</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                    <button onClick={() => setActiveTab("orders")} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>Orders</button>
                    <button onClick={() => setActiveTab("menu")} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'menu' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>Menu</button>
                </div>

                <button onClick={() => setIsAuthenticated(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-slate-100" title="Logout">✕</button>
            </nav>

            {/* Main Content Area */}
            <div className="p-8 max-w-7xl mx-auto">
                {activeTab === "orders" ? <OrdersView apiUrl={API_URL} /> : <MenuView apiUrl={API_URL} />}
            </div>
        </div>
    );
}

export default App;