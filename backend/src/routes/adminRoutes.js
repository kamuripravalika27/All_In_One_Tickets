const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/dashboard-stats', adminController.getDashboardStats);

// Trains CRUD
router.get('/trains', adminController.getAllTrainsAdmin);
router.post('/trains', adminController.createTrain);
router.put('/trains/:id', adminController.updateTrain);
router.delete('/trains/:id', adminController.deleteTrain);

// Flights CRUD
router.get('/flights', adminController.getAllFlightsAdmin);
router.post('/flights', adminController.createFlight);
router.put('/flights/:id', adminController.updateFlight);
router.delete('/flights/:id', adminController.deleteFlight);

// Buses CRUD
router.get('/buses', adminController.getAllBusesAdmin);
router.post('/buses', adminController.createBus);
router.put('/buses/:id', adminController.updateBus);
router.delete('/buses/:id', adminController.deleteBus);

// Users & Bookings
router.get('/users', adminController.getAllUsersAdmin);
router.get('/bookings', adminController.getAllBookingsAdmin);
router.put('/bookings/:id/status', adminController.updateBookingStatusAdmin);

// Coupons CRUD
router.post('/coupons', adminController.createCouponAdmin);
router.delete('/coupons/:id', adminController.deleteCouponAdmin);

// Audit & API Status
router.get('/audit-logs', adminController.getAuditLogsAdmin);
router.get('/api-status', adminController.getApiStatusAdmin);

module.exports = router;
