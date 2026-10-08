const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/cities', searchController.getCities);
router.get('/unified', searchController.unifiedSearch);

module.exports = router;
