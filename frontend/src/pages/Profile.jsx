import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, MapPin, Phone, Mail, Save, LogOut } from 'lucide-react';
import { getAuth, signOut } from "firebase/auth";
import axios from 'axios';

const API_URL = "http://localhost:5000";

export default function Profile({ user }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || "",
        email: user?.email || "",
        phoneNumber: "",
        address: ""
    });

    // Fetch existing details from Backend
    useEffect(() => {
        if(user?.email) {
            axios.get(`${API_URL}/api/users/${user.email}`)
                .then(res => {
                    if(res.data) {
                        setFormData(prev => ({
                            ...prev,
                            phoneNumber: res.data.phoneNumber || "",
                            address: res.data.address || ""
                        }));
                    }
                })
                .catch(err => console.log("Profile fetch error", err));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/users/update`, {
                email: user.email,
                displayName: formData.displayName,
                phoneNumber: formData.phoneNumber,
                address: formData.address
            });
            alert("Profile Updated! ✅");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        }
        setLoading(false);
    };

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => navigate('/'));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* HEADER */}
            <div className="bg-white sticky top-0 z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-slate-500 font-bold hover:text-emerald-600 transition-colors"
                >
                    <ChevronLeft size={20} /> Back to Menu
                </button>
                <h1 className="font-bold text-lg">My Profile</h1>
                <button onClick={handleLogout} className="text-red-500 font-bold text-sm hover:bg-red-50 px-3 py-1 rounded-full transition-colors">
                    Logout
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-xl mx-auto p-6">
                
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-emerald-600 h-32 relative">
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                            <img 
                                src={user?.photoURL || "https://placehold.co/150"} 
                                className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
                                alt="Profile"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-12 pb-8 px-8 text-center">
                        <h2 className="text-2xl font-bold text-slate-800">{user?.displayName}</h2>
                        <p className="text-slate-400 text-sm">{user?.email}</p>
                    </div>

                    <div className="px-8 pb-8 space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <User size={14}/> Full Name
                            </label>
                            <input 
                                type="text" 
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Phone size={14}/> Phone Number
                            </label>
                            <input 
                                type="text" 
                                name="phoneNumber"
                                placeholder="+91 98765 43210"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        {/* Address Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <MapPin size={14}/> Delivery Address
                            </label>
                            <textarea 
                                name="address"
                                placeholder="Room No, Hostel, IIT Kharagpur..."
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                            />
                        </div>

                        {/* Save Button */}
                        <button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? "Saving..." : <><Save size={20}/> Save Changes</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}