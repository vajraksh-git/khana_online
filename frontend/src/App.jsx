import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CustomerApp from "./components/CustomerApp"; // <--- IMPORT THE NEW COMPONENT
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* 👇 CHANGE: Point root "/" directly to CustomerApp, regardless of user */}
        <Route 
            path="/" 
            element={
                <CustomerApp 
                    user={user} 
                    onLogout={() => auth.signOut()} 
                    // 👇 Pass a login trigger so we can open login from inside the app
                    onLoginRequest={() => window.location.href = '/login-page'} 
                />
            } 
        />
        
        {/* Keep a specific route for the actual Login Screen if needed */}
        <Route path="/login-page" element={<Login />} />
        
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;