const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Import Routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes'); // <--- CRITICAL IMPORT

// Config
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json()); 

// --- ROUTES START HERE ---
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes); // <--- THIS MUST BE HERE
// --- ROUTES END HERE ---

app.get('/', (req, res) => {
    res.send('API is running... Kitchen is Open!');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});