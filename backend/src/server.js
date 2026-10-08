const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Security and utility middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300, // limit each IP to 300 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', limiter);

// Mount API routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/search', require('./routes/searchRoutes'));
app.use('/api/v1/trains', require('./routes/trainRoutes'));
app.use('/api/v1/flights', require('./routes/flightRoutes'));
app.use('/api/v1/buses', require('./routes/busRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));
app.use('/api/v1/reviews', require('./routes/reviewRoutes'));
app.use('/api/v1/coupons', require('./routes/couponRoutes'));
app.use('/api/v1/support', require('./routes/supportRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'OneTrip Travel Booking API',
    timestamp: new Date().toISOString(),
    demoMode: true
  });
});

// Central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server after DB Connection
const startServer = async () => {
  await connectDB();
  
  // Auto Seed check if no Train collection items exist
  const Train = require('./models/Train');
  const User = require('./models/User');
  const count = await Train.countDocuments();
  if (count === 0) {
    console.log('[Server] Database is empty. Running initial database seed script...');
    const seedScript = require('child_process');
    seedScript.fork('./src/seeds/seedData.js');
  }

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 OneTrip Backend Server running on port ${PORT}`);
    console.log(`🌐 Health endpoint: http://localhost:${PORT}/health`);
    console.log(`=======================================================`);
  });
};

startServer();

module.exports = app;
