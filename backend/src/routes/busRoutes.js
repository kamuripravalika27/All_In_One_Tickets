const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

router.get('/search', busController.searchBuses);
router.get('/:id', busController.getBusById);
router.get('/:id/seats', busController.getBusSeatLayout);

module.exports = router;
