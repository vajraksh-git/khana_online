import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

function OrdersView({ apiUrl }) {
    const [orders, setOrders] = useState([]);
    const audioRef = useRef(new Audio(NOTIFICATION_SOUND));

    useEffect(() => {
        axios.get(`${apiUrl}/api/admin/orders`).then(res => setOrders(res.data));
        const socket = io(apiUrl);
        socket.on('new-order', (newOrder) => {
            audioRef.current.play().catch(e => console.log("Audio block", e));
            setOrders(prev => [newOrder, ...prev]);
        });
        return () => socket.disconnect();
    }, [apiUrl]);

    const completeOrder = async (id) => {
        await axios.put(`${apiUrl}/api/admin/orders/${id}`, { status: "Completed" });
        setOrders(prev => prev.filter(order => order._id !== id));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {orders.length === 0 && <div className="col-span-full text-center py-20 text-slate-400">No active orders</div>}
            
            {orders.map(order => (
                <div key={order._id} className="bg-white border border-gray-100 shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all">
                    <div className="bg-emerald-500 p-4 text-white flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{order.customerName}</h3>
                            <p className="text-emerald-100 text-xs font-mono">#{order._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold animate-pulse">PREPARING 👨‍🍳</span>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex gap-4 text-xs font-bold text-gray-500 mb-4">
                            <span>📞 {order.phoneNumber}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-bold mb-4 bg-gray-50 p-2 rounded-lg">📍 {order.address}</p>

                        {/* STANDARD ITEMS */}
                        {order.items && order.items.length > 0 && (
                            <ul className="space-y-2 mb-4">
                                {order.items.map((item, i) => (
                                    <li key={i} className="flex justify-between text-sm text-slate-700">
                                        <span>{item.quantity}x {item.name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* CUSTOM PLATTERS */}
                        {order.combos && order.combos.length > 0 && order.combos.map((combo, i) => (
                            <div key={i} className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl mb-4">
                                <h4 className="font-bold text-emerald-800 text-sm flex justify-between">
                                    {combo.name} <span>₹{combo.price}</span>
                                </h4>
                                <p className="text-[10px] text-emerald-600 mb-2 uppercase tracking-wider">{combo.cuisine}</p>
                                <ul className="text-xs text-slate-700 space-y-1 ml-2 border-l-2 border-emerald-200 pl-2">
                                    <li>🍛 <b>Main:</b> {combo.details.main}</li>
                                    <li>🥗 <b>Side:</b> {combo.details.side}</li>
                                    <li>🍞 <b>Staple:</b> {combo.details.staple}</li>
                                </ul>
                            </div>
                        ))}

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