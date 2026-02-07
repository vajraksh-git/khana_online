import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin, apiUrl }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${apiUrl}/api/admin/login`, { username, password });
            if (res.data.success) onLogin(); // Tell App.jsx we are in!
        } catch (err) {
            alert("Wrong password!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-100">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-100 to-white"></div>
            <form onSubmit={handleSubmit} className="relative z-10 bg-white p-10 rounded-3xl shadow-2xl w-96 border border-gray-100 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                        <span className="text-3xl">👨‍🍳</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Kitchen Access</h2>
                    <p className="text-slate-400 text-sm mt-1">Welcome back, Chef.</p>
                </div>
                
                <div className="space-y-4">
                    <input className="w-full bg-gray-50 border border-gray-200 text-slate-900 placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center font-medium" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
                    <input className="w-full bg-gray-50 border border-gray-200 text-slate-900 placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center font-medium" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl font-bold mt-8 shadow-lg shadow-emerald-200 transition-all transform active:scale-95">Login</button>
            </form>
        </div>
    );
}

export default Login;