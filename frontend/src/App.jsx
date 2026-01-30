import { useState, useEffect } from 'react';
import axios from 'axios';

// 👇 PASTE YOUR RENDER LINK HERE (Make sure there is NO slash at the end)
const API_URL = "https://desimakingvedesi-backend.onrender.com"; 

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [viewCart, setViewCart] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Menu
  useEffect(() => {
    // Uses the new API_URL string
    axios.get(`${API_URL}/api/menu`)
      .then(res => {
        setMenu(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  // 2. Add Item to Cart
  const addToCart = (item) => {
    const newItem = { ...item, cartId: Date.now() };
    setCart([...cart, newItem]);
  };

  // 3. Remove Item from Cart
  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // 4. Send Order to Backend
  const placeOrder = async () => {
    try {
        const orderData = {
            customerName: "Vajraksh", 
            phoneNumber: "9999999999",
            paymentMethod: "UPI",
            totalAmount: cart.reduce((sum, item) => sum + item.price, 0),
            items: cart.map(item => ({
                menuItem: item._id,
                quantity: 1,
                name: item.name,
                price: item.price
            }))
        };

        // Uses the new API_URL string
        const res = await axios.post(`${API_URL}/api/orders`, orderData);
        alert(`Order Placed! Order ID: ${res.data._id}`);
        setCart([]); 
        setViewCart(false); 
    } catch (error) {
        console.error("Order failed:", error);
        alert("Failed to place order. Check console.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading tasty food...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white p-4 shadow-md rounded-xl mb-6 sticky top-0 z-50">
        <h1 
            className="text-2xl font-bold text-orange-600 cursor-pointer"
            onClick={() => setViewCart(false)}
        >
            DesiVidesi 🍗
        </h1>
        <button 
            className="bg-black text-white px-4 py-2 rounded-lg font-bold"
            onClick={() => setViewCart(!viewCart)}
        >
          {viewCart ? "Close Cart" : `Cart (${cart.length})`} 🛒
        </button>
      </nav>

      {/* CONDITIONAL RENDERING: Show Cart OR Show Menu */}
      {viewCart ? (
        // --- CART VIEW ---
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cart.length === 0 ? <p>Cart is empty. Go eat something!</p> : (
                <>
                    {cart.map((item) => (
                        <div key={item.cartId} className="flex justify-between border-b py-2">
                            <span>{item.name}</span>
                            <div className="flex items-center gap-4">
                                <span className="font-bold">₹{item.price}</span>
                                <button 
                                    onClick={() => removeFromCart(item.cartId)}
                                    className="text-red-500 text-sm"
                                >Remove</button>
                            </div>
                        </div>
                    ))}
                    
                    <div className="mt-6 flex justify-between items-center border-t pt-4">
                        <h3 className="text-xl font-bold">Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}</h3>
                        <button 
                            onClick={placeOrder}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700"
                        >
                            PLACE ORDER 🚀
                        </button>
                    </div>
                </>
            )}
        </div>
      ) : (
        // --- MENU VIEW ---
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {menu.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">₹{item.price}</p>
                <p className="text-gray-400 text-xs mt-1">{item.category}</p>
              </div>
              <button 
                className="bg-orange-100 text-orange-600 font-bold px-4 py-2 rounded-lg hover:bg-orange-200"
                onClick={() => addToCart(item)}
              >
                ADD +
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;