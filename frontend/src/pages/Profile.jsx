import { useState, useEffect } from 'react';
import axios from 'axios';
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Ensure this path is correct based on your folder structure

const API_URL = "http://localhost:5000";

function Profile({ user }) {
    // 1. Local State for the Form
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState(""); 

    // 2. Load Data on Mount
    useEffect(() => {
        if (user.email) {
            axios.get(`${API_URL}/api/users/${user.email}`)
                .then(res => {
                    // Pre-fill the form with DB data (if it exists)
                    setPhone(res.data.phone || "");
                    setAddress(res.data.address || "");
                })
                .catch(err => console.error("Failed to load profile", err));
        }
    }, [user]);

    // 3. Save Data
    const handleSave = async (e) => {
        e.preventDefault();
        setStatus("Saving...");

        try {
            const res = await axios.put(`${API_URL}/api/users/profile`, {
                email: user.email, 
                phone: phone,
                address: address
            });
            
            if (res.data) {
                setStatus("✅ Profile Updated Successfully!");
                setPhone(res.data.phone);
                setAddress(res.data.address);
            }
        } catch (err) {
            console.error(err);
            setStatus("❌ Update Failed. Check Backend Console.");
        }
    };

    // 4. Logout Function
    const handleLogout = () => {
        if(confirm("Are you sure you want to logout?")) {
            signOut(auth).catch((error) => {
                console.error("Logout Error:", error);
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
            
            {/* Profile Card */}
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl">
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                    <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-emerald-100 shadow-sm mb-4"
                    />
                    <h2 className="text-2xl font-bold text-gray-800">{user.displayName}</h2>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="space-y-4">
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-400 ml-1 uppercase mb-1">Phone Number</label>
                        <input 
                            type="tel" 
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700 outline-none transition-all"
                            placeholder="e.g. 9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 ml-1 uppercase mb-1">Delivery Address</label>
                        <textarea 
                            rows="3"
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700 outline-none transition-all resize-none"
                            placeholder="Room No, Hostel/Block..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 mt-4"
                    >
                        Save Profile
                    </button>

                    {status && (
                        <p className={`text-center text-sm font-bold mt-2 ${status.includes("Failed") ? "text-red-500" : "text-emerald-600"}`}>
                            {status}
                        </p>
                    )}
                </form>

                {/* LOGOUT BUTTON (Restored) */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 font-bold py-3 rounded-xl transition-all"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Profile;