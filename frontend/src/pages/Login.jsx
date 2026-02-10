import { signInWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import myLogo from '../assets/logo.png'; // <--- IMPORT YOUR LOGO HERE

// 👇 PASTE YOUR LOCALHOST OR RENDER LINK HERE
//const API_URL = "http://localhost:5000"; 
const API_URL = "https://desimakingvedesi-backend.onrender.com"; // Keep this for later when deploying
function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        const user = await signInWithGoogle();
        
        if (user) {
            // Save to MongoDB
            await axios.post(`${API_URL}/api/users/login`, {
                name: user.displayName,
                email: user.email,
                googleId: user.uid,
                photo: user.photoURL
            });
            navigate('/dashboard');
        }
    } catch (error) {
        console.error("Login Failed:", error);
        alert("Login failed. Check console.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      
      {/* 1. BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop')",
            filter: "brightness(0.3)" 
        }}
      ></div>

      {/* 2. THE CARD */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl max-w-sm w-full text-center animate-card">
        
        {/* 🔥 YOUR LOGO */}
        <div className="mx-auto w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-emerald-500 overflow-hidden p-1">
            <img 
                src={myLogo} 
                alt="Desi Making Vedesi Logo" 
                className="w-full h-full object-contain rounded-full"
            />
        </div>

        {/* BRAND NAME */}
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight font-serif">
          Desi Making <span className="text-emerald-400">Vedesi</span>
        </h1>
        <p className="text-gray-300 mb-8 text-sm font-light">Authentic taste, modern style.</p>

        {/* LOGIN BUTTON */}
        <button 
          onClick={handleLogin}
          className="w-full bg-white text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="G" />
          Login with Google
        </button>

      </div>
    </div>
  );
}

export default Login;