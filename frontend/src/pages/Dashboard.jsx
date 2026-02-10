import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';

//const API_URL = "http://localhost:5000"; 
const API_URL = "https://desimakingvedesi-backend.onrender.com"; // Keep this for later when deploying

function Dashboard({ user }) {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dbUser, setDbUser] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    // 1. Fetch Menu
    axios.get(`${API_URL}/api/menu`)
      .then(res => setMenu(res.data))
      .catch(err => console.error(err));

    // 2. Fetch User Details to check Address & Phone
    if (user.email) {
        console.log("Fetching data for:", user.email); // <--- DEBUG 1

        axios.get(`${API_URL}/api/users/${user.email}`)
            .then(res => {
                console.log("DATABASE RETURNED:", res.data); // <--- DEBUG 2: What is in here?
                setDbUser(res.data);
            })
            .catch(err => console.error("FETCH ERROR:", err));
    }
  }, [user]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existing = prevCart.find(i => i._id === item._id);
      if (existing) {
        return prevCart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, change) => {
    setCart(prevCart => prevCart.map(item => {
        if (item._id === itemId) {
            return { ...item, quantity: Math.max(0, item.quantity + change) };
        }
        return item;
    }).filter(item => item.quantity > 0));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- LOGIC START ---
  
  // 1. BRIDGE THE GAP: Get the phone number regardless of what it's called
  const userPhone = dbUser?.phone || dbUser?.phoneNumber; 
  const userAddress = dbUser?.address;

  // 2. THE CHECK: Does user have BOTH Address AND Phone?
  const isProfileComplete = userAddress && userPhone;

  const placeOrder = async () => {
      try {
          const orderData = {
              customerName: user.displayName,
              email: user.email,
              
              // 3. THE PAYLOAD: Send 'phone' to the Order API as 'phoneNumber'
              phoneNumber: userPhone, 
              
              address: userAddress,   
              items: cart.map(item => ({
                  menuItem: item._id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price
              })),
              totalAmount: totalAmount
          };
          
          await axios.post(`${API_URL}/api/orders`, orderData);
          alert("Order Placed Successfully!");
          setCart([]);
          setIsCartOpen(false);
      } catch (err) {
          console.error(err);
          alert("Order failed. Check console.");
      }
  };
  // --- LOGIC END ---

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-3">
            <img 
                src={user.photoURL} 
                className="w-10 h-10 rounded-full border-2 border-emerald-500 cursor-pointer hover:scale-105 transition-transform" 
                onClick={() => navigate('/profile')}
            />
            <div>
                <h1 className="text-sm font-bold text-gray-800">Hi, {user.displayName.split(' ')[0]}!</h1>
                <p className="text-xs text-emerald-600 font-bold">Craving something delicious?</p>
            </div>
        </div>
      </header>

      {/* BANNER */}
      <div className="px-6 mt-6 mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200 transform hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-1">Fresh & Fast 🥗</h2>
            <p className="text-emerald-100 text-sm">Healthy meals delivered to your door.</p>
        </div>
      </div>

      {/* MENU */}
      <div className="px-6">
        <h3 className="font-bold text-xl text-gray-800 mb-4 ml-1">Today's Menu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.map(item => (
                <ItemCard key={item._id} item={item} addToCart={addToCart} />
            ))}
        </div>
      </div>

      {/* BOTTOM BAR (Cart Trigger) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-6 right-6 z-40 animate-slide-up">
            <div 
                onClick={() => setIsCartOpen(true)}
                className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center cursor-pointer hover:bg-black transition-colors"
            >
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{totalItems} ITEMS</span>
                    <span className="text-lg font-bold">₹{totalAmount}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-emerald-400 bg-white/10 px-4 py-2 rounded-xl">
                    View Cart <span>→</span>
                </div>
            </div>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-end bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}>
            <div className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Order</h2>
                    <button onClick={() => setIsCartOpen(false)} className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 font-bold">✕</button>
                </div>

                <div className="max-h-[40vh] overflow-y-auto space-y-4 mb-6 pr-2">
                    {cart.map(item => (
                        <div key={item._id} className="flex justify-between items-center border-b border-gray-50 pb-4">
                            <div>
                                <h4 className="font-bold text-gray-800">{item.name}</h4>
                                <p className="text-sm text-gray-500">₹{item.price * item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                                <button onClick={() => updateQuantity(item._id, -1)} className="text-gray-400 hover:text-red-500 font-bold px-2">-</button>
                                <span className="font-bold text-sm text-gray-800 min-w-[20px] text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item._id, 1)} className="text-emerald-600 font-bold px-2">+</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 👇 GATEKEEPER LOGIC */}
                {isProfileComplete ? (
                    // 1. GREEN LIGHT: User has info -> Show Order Button
                    <>
                        <div className="bg-emerald-50 p-4 rounded-xl mb-4 border border-emerald-100 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Delivering To:</p>
                                <p className="text-sm font-bold text-gray-800 line-clamp-1">{userAddress}</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => navigate('/profile')}>
                                <span className="text-xs font-bold text-emerald-600">Edit</span>
                            </div>
                        </div>
                        <button 
                            onClick={placeOrder}
                            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
                        >
                            Pay ₹{totalAmount} & Order
                        </button>
                    </>
                ) : (
                    // 2. RED LIGHT: User missing info -> Show Warning
                    <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center">
                        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                            ⚠️
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">Profile Incomplete</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Please add your <b>Phone Number</b> and <b>Address</b> to continue.
                        </p>
                        
                        <button 
                            onClick={() => navigate('/profile')}
                            className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                        >
                            Complete Profile →
                        </button>
                    </div>
                )}

            </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;