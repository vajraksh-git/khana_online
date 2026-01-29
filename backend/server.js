// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // Native Node module
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menuRoutes'); // <-- ADD THIS
// 1. Load Config
dotenv.config();
connectDB();

// 2. Setup App & Socket.io
const app = express();
const server = http.createServer(app); // Wrap Express in HTTP Server

const io = new Server(server, {
    cors: {
        origin: "*", // Allow connections from React (We'll restrict this later)
        methods: ["GET", "POST"]
    }
});

// 3. Make 'io' accessible in Routes (The "Magic" Step)
// This lets you use `req.app.get('socketio')` in your controllers later!
app.set('socketio', io);

// 4. Middleware
app.use(cors());
app.use(express.json()); // Allows you to read JSON from body

// 5. Test Route
app.get('/', (req, res) => {
    res.send('API is running... Kitchen is Open!');
});

app.use('/api/menu', menuRoutes); // <-- ADD THIS

// 6. Socket Connection Logic
io.on('connection', (socket) => {
    console.log('A user/kitchen connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});