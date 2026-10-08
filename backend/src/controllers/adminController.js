const User = require('../models/User');
const Booking = require('../models/Booking');
const Train = require('../models/Train');
const Flight = require('../models/Flight');
const Bus = require('../models/Bus');
const Coupon = require('../models/Coupon');
const AuditLog = require('../models/AuditLog');
const demoProvider = require('../adapters/demoProvider');

const logAdminAction = async (req, action, targetResource, targetId, details) => {
  try {
    await AuditLog.create({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action,
      targetResource,
      targetId: targetId ? targetId.toString() : '',
      details
    });
  } catch (err) {
    console.error('AuditLog writing failed:', err.message);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalBookings = await Booking.countDocuments();
    const trainBookings = await Booking.countDocuments({ transportType: 'train' });
    const flightBookings = await Booking.countDocuments({ transportType: 'flight' });
    const busBookings = await Booking.countDocuments({ transportType: 'bus' });
    const pendingBookings = await Booking.countDocuments({ bookingStatus: 'Pending' });
    const cancellations = await Booking.countDocuments({ bookingStatus: 'Cancelled' });

    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$finalAmount' } } }
    ]);
    const demoRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Monthly chart data (simulated/real aggregated)
    const monthlyData = [
      { month: 'Jan', revenue: 45000, bookings: 120 },
      { month: 'Feb', revenue: 52000, bookings: 145 },
      { month: 'Mar', revenue: 68000, bookings: 190 },
      { month: 'Apr', revenue: 84000, bookings: 230 },
      { month: 'May', revenue: 95000, bookings: 270 },
      { month: 'Jun', revenue: 112000, bookings: 310 }
    ];

    const modeShare = [
      { name: 'Train', value: trainBookings || 35 },
      { name: 'Flight', value: flightBookings || 25 },
      { name: 'Bus', value: busBookings || 40 }
    ];

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        trainBookings,
        flightBookings,
        busBookings,
        pendingBookings,
        cancellations,
        demoRevenue
      },
      charts: {
        monthlyData,
        modeShare
      }
    });
  } catch (error) {
    next(error);
  }
};

// CRUD TRAINS
exports.getAllTrainsAdmin = async (req, res, next) => {
  try {
    const trains = await Train.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: trains.length, trains });
  } catch (error) {
    next(error);
  }
};

exports.createTrain = async (req, res, next) => {
  try {
    const train = await Train.create(req.body);
    await logAdminAction(req, 'CREATE_TRAIN', 'Train', train._id, `Created train ${train.trainNumber} - ${train.trainName}`);
    return res.status(201).json({ success: true, message: 'Train service created successfully.', train });
  } catch (error) {
    next(error);
  }
};

exports.updateTrain = async (req, res, next) => {
  try {
    const train = await Train.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logAdminAction(req, 'UPDATE_TRAIN', 'Train', train._id, `Updated train ${train.trainNumber}`);
    return res.json({ success: true, message: 'Train updated.', train });
  } catch (error) {
    next(error);
  }
};

exports.deleteTrain = async (req, res, next) => {
  try {
    const train = await Train.findByIdAndDelete(req.params.id);
    await logAdminAction(req, 'DELETE_TRAIN', 'Train', req.params.id, `Deleted train service.`);
    return res.json({ success: true, message: 'Train deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// CRUD FLIGHTS
exports.getAllFlightsAdmin = async (req, res, next) => {
  try {
    const flights = await Flight.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: flights.length, flights });
  } catch (error) {
    next(error);
  }
};

exports.createFlight = async (req, res, next) => {
  try {
    const flight = await Flight.create(req.body);
    await logAdminAction(req, 'CREATE_FLIGHT', 'Flight', flight._id, `Created flight ${flight.flightNumber}`);
    return res.status(201).json({ success: true, message: 'Flight service created.', flight });
  } catch (error) {
    next(error);
  }
};

exports.updateFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logAdminAction(req, 'UPDATE_FLIGHT', 'Flight', flight._id, `Updated flight ${flight.flightNumber}`);
    return res.json({ success: true, message: 'Flight updated.', flight });
  } catch (error) {
    next(error);
  }
};

exports.deleteFlight = async (req, res, next) => {
  try {
    await Flight.findByIdAndDelete(req.params.id);
    await logAdminAction(req, 'DELETE_FLIGHT', 'Flight', req.params.id, `Deleted flight service.`);
    return res.json({ success: true, message: 'Flight deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// CRUD BUSES
exports.getAllBusesAdmin = async (req, res, next) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: buses.length, buses });
  } catch (error) {
    next(error);
  }
};

exports.createBus = async (req, res, next) => {
  try {
    const bus = await Bus.create(req.body);
    await logAdminAction(req, 'CREATE_BUS', 'Bus', bus._id, `Created bus ${bus.busNumber}`);
    return res.status(201).json({ success: true, message: 'Bus service created.', bus });
  } catch (error) {
    next(error);
  }
};

exports.updateBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logAdminAction(req, 'UPDATE_BUS', 'Bus', bus._id, `Updated bus ${bus.busNumber}`);
    return res.json({ success: true, message: 'Bus updated.', bus });
  } catch (error) {
    next(error);
  }
};

exports.deleteBus = async (req, res, next) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    await logAdminAction(req, 'DELETE_BUS', 'Bus', req.params.id, `Deleted bus service.`);
    return res.json({ success: true, message: 'Bus deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// MANAGE USERS & BOOKINGS
exports.getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

exports.getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    return res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatusAdmin = async (req, res, next) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();
    await logAdminAction(req, 'UPDATE_BOOKING_STATUS', 'Booking', booking._id, `Changed status to ${bookingStatus}, payment to ${paymentStatus}`);

    return res.json({ success: true, message: 'Booking status updated successfully.', booking });
  } catch (error) {
    next(error);
  }
};

// COUPONS CRUD
exports.createCouponAdmin = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    await logAdminAction(req, 'CREATE_COUPON', 'Coupon', coupon._id, `Created promo coupon ${coupon.code}`);
    return res.status(201).json({ success: true, message: 'Coupon created successfully.', coupon });
  } catch (error) {
    next(error);
  }
};

exports.deleteCouponAdmin = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    await logAdminAction(req, 'DELETE_COUPON', 'Coupon', req.params.id, 'Deleted coupon.');
    return res.json({ success: true, message: 'Coupon deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// AUDIT LOGS & API STATUS
exports.getAuditLogsAdmin = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
};

exports.getApiStatusAdmin = async (req, res, next) => {
  try {
    const providerStatus = await demoProvider.getStatus();
    const razorpayConfigured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id');

    return res.json({
      success: true,
      apiStatus: {
        environment: process.env.NODE_ENV || 'development',
        transportProvider: providerStatus,
        paymentGateway: {
          name: 'Razorpay / Demo Simulator',
          isConfigured: razorpayConfigured,
          mode: razorpayConfigured ? 'RAZORPAY_TEST_MODE' : 'DEMO_PAYMENT_SIMULATOR'
        },
        database: {
          status: 'CONNECTED',
          name: 'MongoDB / Memory Server'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
