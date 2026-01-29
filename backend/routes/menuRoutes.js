// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem } = require('../controllers/menuController');

router.get('/', getMenu);      // When they visit /api/menu
router.post('/', addMenuItem); // When they send data to /api/menu

module.exports = router;