import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client'; // <--- Import Socket.io

// A simple notification sound URL
const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

function OrdersView({ apiUrl }) {
    const [orders, setOrders] = useState([]);
    const audioRef = useRef(new Audio(NOTIFICATION_SOUND)); // Create Audio player

    useEffect(() => {
        // 1. Initial Load
        axios.get(`${apiUrl}/api/admin/orders`).then(res => setOrders(res.data));

        // 2. Connect to Socket
        const socket = io(apiUrl);

        // 3. Listen for "new-order" event from Backend
        socket.on('new-order', (newOrder) => {
            // Play Sound 🔔
            audioRef.current.play().catch(e => console.log("Audio play failed (browser blocked):", e));
            
            // Add new order to TOP of list instantly
            setOrders(prevOrders => [newOrder, ...prevOrders]);
            
            // Optional: Browser Alert
            alert(`New Order from ${newOrder.customerName}!`);
        });

        // Cleanup when component closes
        return () => {
            socket.disconnect();
        };
    }, [apiUrl]);

    const completeOrder = async (id) => {
        await axios.put(`${apiUrl}/api/admin/orders/${id}`, { status: "Completed" });
        // Optimistic Update (Remove from list immediately)
        setOrders(prev => prev.filter(order => order._id !== id));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {orders.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-50">
                    <span className="text-6xl mb-4">🥒</span>
                    <h3 className="text-2xl font-bold text-slate-400">All caught up!</h3>
                    <p className="text-slate-400">Waiting for orders...</p>
                </div>
            )}
            
            {orders.map(order => (
                <div key={order._id} className="bg-white border border-gray-100 shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                    {/* New Order Tag (Visual Flair) */}
                    <div className="bg-emerald-500 p-4 text-white flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{order.customerName}</h3>
                            <p className="text-emerald-100 text-xs font-mono">#{order._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm animate-pulse">PREPARING 👨‍🍳</span>
                    </div>
                    
                    <div className="p-6">
                        <p className="text-xs text-gray-500 font-bold mb-2">📞 {order.phoneNumber}</p>
                        <ul className="space-y-3 mb-6 bg-gray-50 p-3 rounded-xl">
                            {order.items.map((item, i) => (
                                <li key={i} className="flex justify-between items-center text-slate-700">
                                    <span className="flex items-center gap-2">
                                        <span className="bg-emerald-100 text-emerald-700 font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs">{item.quantity}</span>
                                        <span className="font-medium">{item.name}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                            <p className="text-xl font-bold text-slate-800">₹{order.totalAmount}</p>
                            <button onClick={() => completeOrder(order._id)} className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all">Done ✅</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OrdersView;