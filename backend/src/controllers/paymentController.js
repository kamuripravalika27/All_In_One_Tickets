const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const BusSeatInventory = require('../models/BusSeatInventory');
const Notification = require('../models/Notification');
const crypto = require('crypto');
const Razorpay = require('razorpay');

let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id') {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  } catch (err) {
    console.warn('[Razorpay] Initialization skipped, using Demo Payment Mode.');
  }
}

exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod = 'Demo Payment' } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.paymentStatus === 'Paid') {
      return res.status(400).json({ success: false, message: 'Booking is already paid.' });
    }

    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (razorpayInstance && paymentMethod !== 'Demo Payment') {
      const options = {
        amount: Math.round(booking.finalAmount * 100), // amount in paise
        currency: 'INR',
        receipt: booking.bookingRef,
        notes: {
          bookingId: booking._id.toString(),
          transportType: booking.transportType
        }
      };

      const order = await razorpayInstance.orders.create(options);

      const payment = await Payment.create({
        bookingId: booking._id,
        userId: req.user._id,
        amount: booking.finalAmount,
        currency: 'INR',
        paymentMethod,
        transactionId,
        razorpayOrderId: order.id,
        paymentStatus: 'Pending',
        demoSimulated: false
      });

      return res.json({
        success: true,
        mode: 'RAZORPAY',
        key: process.env.RAZORPAY_KEY_ID,
        order,
        paymentId: payment._id
      });
    }

    // Demo Mode Payment Order
    const payment = await Payment.create({
      bookingId: booking._id,
      userId: req.user._id,
      amount: booking.finalAmount,
      currency: 'INR',
      paymentMethod,
      transactionId,
      paymentStatus: 'Pending',
      demoSimulated: true
    });

    return res.json({
      success: true,
      mode: 'DEMO',
      transactionId,
      paymentId: payment._id,
      amount: booking.finalAmount,
      message: 'Demo Payment Mode Active. No real money will be charged.'
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyAndConfirmPayment = async (req, res, next) => {
  try {
    const {
      paymentId,
      bookingId,
      paymentMethod = 'UPI',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      simulatedResult = 'SUCCESS'
    } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Associated booking not found.' });
    }

    const payment = await Payment.findById(paymentId);

    if (simulatedResult === 'FAILURE') {
      if (payment) {
        payment.paymentStatus = 'Failed';
        await payment.save();
      }
      booking.paymentStatus = 'Failed';
      booking.bookingStatus = 'Pending';
      await booking.save();

      return res.status(400).json({
        success: false,
        message: 'Payment transaction failed or declined. Please retry.'
      });
    }

    // If Razorpay live signature check
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature && razorpayInstance) {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature verification failed.' });
      }

      if (payment) {
        payment.razorpayOrderId = razorpayOrderId;
        payment.razorpayPaymentId = razorpayPaymentId;
        payment.paymentStatus = 'Paid';
        await payment.save();
      }
    } else {
      // Demo Payment Auto-Verification
      if (payment) {
        payment.paymentStatus = 'Paid';
        payment.paymentMethod = paymentMethod;
        await payment.save();
      }
    }

    // Update Booking status atomically
    booking.paymentStatus = 'Paid';
    booking.bookingStatus = 'Confirmed';
    await booking.save();

    // If bus booking, lock seats permanently in inventory
    if (booking.transportType === 'bus' && booking.seatNumbers.length > 0) {
      let inventory = await BusSeatInventory.findOne({ busId: booking.transportId, date: booking.snapshot.journeyDate });
      if (inventory) {
        inventory.seats.forEach(s => {
          if (booking.seatNumbers.includes(s.seatNo)) {
            s.status = 'booked';
            s.bookedByPassengerId = req.user._id.toString();
          }
        });
        await inventory.save();
      }
    }

    await Notification.create({
      user: req.user._id,
      title: 'Booking Confirmed!',
      message: `Your booking #${booking.bookingRef} is CONFIRMED. PNR: ${booking.PNR}.`,
      type: 'PAYMENT'
    });

    return res.json({
      success: true,
      message: 'Payment verified and booking confirmed successfully!',
      bookingRef: booking.bookingRef,
      PNR: booking.PNR,
      booking
    });
  } catch (error) {
    next(error);
  }
};
