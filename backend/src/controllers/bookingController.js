const Booking = require('../models/Booking');
const Train = require('../models/Train');
const Flight = require('../models/Flight');
const Bus = require('../models/Bus');
const BusSeatInventory = require('../models/BusSeatInventory');
const Coupon = require('../models/Coupon');
const Notification = require('../models/Notification');
const crypto = require('crypto');

const generateBookingRef = () => `OTB-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
const generatePNR = () => `DEMO-${Math.floor(100000000 + Math.random() * 900000000)}`;

exports.createBooking = async (req, res, next) => {
  try {
    const {
      transportType,
      transportId,
      passengers,
      contactEmail,
      contactPhone,
      travelClass,
      seatNumbers = [],
      journeyDate,
      couponCode,
      boardingPoint,
      droppingPoint
    } = req.body;

    if (!transportType || !transportId || !passengers || passengers.length === 0 || !journeyDate) {
      return res.status(400).json({ success: false, message: 'Missing required booking details.' });
    }

    let transportObj = null;
    let basePricePerPassenger = 0;
    let snapshotData = {};

    if (transportType === 'train') {
      transportObj = await Train.findById(transportId);
      if (!transportObj) return res.status(404).json({ success: false, message: 'Train service not found.' });
      
      const selectedClass = transportObj.classes.find(c => c.code === travelClass || c.className === travelClass) || transportObj.classes[0];
      basePricePerPassenger = selectedClass.fare;

      snapshotData = {
        transportName: transportObj.trainName,
        transportNumber: transportObj.trainNumber,
        sourceCity: transportObj.sourceCity,
        destinationCity: transportObj.destinationCity,
        departureStation: transportObj.departureStation,
        arrivalStation: transportObj.arrivalStation,
        departureTime: transportObj.departureTime,
        arrivalTime: transportObj.arrivalTime,
        journeyDate,
        travelClass: selectedClass.className,
        duration: transportObj.duration
      };

    } else if (transportType === 'flight') {
      transportObj = await Flight.findById(transportId);
      if (!transportObj) return res.status(404).json({ success: false, message: 'Flight not found.' });

      const selectedClass = transportObj.classes.find(c => c.className === travelClass) || transportObj.classes[0];
      basePricePerPassenger = selectedClass.fare;

      snapshotData = {
        transportName: transportObj.airlineName,
        transportNumber: transportObj.flightNumber,
        operatorName: transportObj.airlineName,
        sourceCity: transportObj.sourceCity,
        destinationCity: transportObj.destinationCity,
        departureStation: transportObj.sourceAirport,
        arrivalStation: transportObj.destinationAirport,
        departureTime: transportObj.departureTime,
        arrivalTime: transportObj.arrivalTime,
        journeyDate,
        travelClass: selectedClass.className,
        duration: transportObj.duration
      };

    } else if (transportType === 'bus') {
      transportObj = await Bus.findById(transportId);
      if (!transportObj) return res.status(404).json({ success: false, message: 'Bus service not found.' });

      basePricePerPassenger = transportObj.fare;

      // ATOMIC CHECK FOR BUS SEATS TO PREVENT DOUBLE BOOKING
      if (seatNumbers.length > 0) {
        let inventory = await BusSeatInventory.findOne({ busId: transportId, date: journeyDate });
        if (inventory) {
          const unavailableSeats = seatNumbers.filter(sNum => {
            const seat = inventory.seats.find(s => s.seatNo === sNum);
            return seat && seat.status === 'booked';
          });

          if (unavailableSeats.length > 0) {
            return res.status(400).json({
              success: false,
              message: `Seats ${unavailableSeats.join(', ')} are already booked by another passenger. Please select available seats.`
            });
          }
        }
      }

      snapshotData = {
        transportName: `${transportObj.operatorName} (${transportObj.busType})`,
        transportNumber: transportObj.busNumber,
        operatorName: transportObj.operatorName,
        sourceCity: transportObj.sourceCity,
        destinationCity: transportObj.destinationCity,
        departureStation: boardingPoint || transportObj.sourceCity,
        arrivalStation: droppingPoint || transportObj.destinationCity,
        departureTime: transportObj.departureTime,
        arrivalTime: transportObj.arrivalTime,
        journeyDate,
        travelClass: transportObj.busType,
        duration: transportObj.duration
      };
    } else {
      return res.status(400).json({ success: false, message: 'Invalid transport type specified.' });
    }

    // Calculations
    const passengerCount = passengers.length;
    const totalBaseFare = basePricePerPassenger * passengerCount;
    const totalTaxes = Math.round(totalBaseFare * 0.05); // 5% GST/taxes
    const serviceFee = 20;
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date(coupon.expiresAt) > new Date() && totalBaseFare >= coupon.minBookingAmount) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.min((totalBaseFare * coupon.discountValue) / 100, coupon.maxDiscount);
        } else {
          discountAmount = Math.min(coupon.discountValue, coupon.maxDiscount);
        }
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const finalAmount = Math.max(0, totalBaseFare + totalTaxes + serviceFee - discountAmount);
    const bookingRef = generateBookingRef();
    const PNR = generatePNR();

    const booking = await Booking.create({
      bookingRef,
      PNR,
      user: req.user._id,
      transportType,
      transportId,
      snapshot: snapshotData,
      passengers,
      contactEmail,
      contactPhone,
      seatNumbers,
      boardingPoint: boardingPoint || snapshotData.departureStation,
      droppingPoint: droppingPoint || snapshotData.arrivalStation,
      totalBaseFare,
      totalTaxes,
      serviceFee,
      discountAmount,
      couponCode: couponCode || '',
      finalAmount,
      paymentStatus: 'Pending',
      bookingStatus: 'Pending'
    });

    await Notification.create({
      user: req.user._id,
      title: 'Booking Reserved',
      message: `Your demo booking #${bookingRef} (${snapshotData.transportName}) is pending payment.`,
      type: 'BOOKING'
    });

    return res.status(201).json({
      success: true,
      message: 'Booking initialized successfully. Proceed to payment.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email phone');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking reference not found.' });
    }

    // Security check: User can only view their own booking unless admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this booking.' });
    }

    return res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    // Cancellation refund logic (demo: 90% refund if paid, 0 if pending)
    const isPaid = booking.paymentStatus === 'Paid';
    const refundAmount = isPaid ? Math.round(booking.finalAmount * 0.9) : 0;
    const cancellationFee = isPaid ? booking.finalAmount - refundAmount : 0;

    booking.bookingStatus = 'Cancelled';
    booking.paymentStatus = isPaid ? 'Refunded' : 'Failed';
    booking.cancellationDetails = {
      cancelledAt: new Date(),
      refundAmount,
      cancellationFee,
      reason: reason || 'Customer requested cancellation',
      refundStatus: isPaid ? 'Processed' : 'Not Applicable'
    };

    await booking.save();

    // Release bus seats if bus booking
    if (booking.transportType === 'bus' && booking.seatNumbers.length > 0) {
      let inventory = await BusSeatInventory.findOne({ busId: booking.transportId, date: booking.snapshot.journeyDate });
      if (inventory) {
        inventory.seats.forEach(s => {
          if (booking.seatNumbers.includes(s.seatNo)) {
            s.status = 'available';
            s.bookedByPassengerId = null;
          }
        });
        await inventory.save();
      }
    }

    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled',
      message: `Your booking #${booking.bookingRef} has been cancelled. Refund of ₹${refundAmount} processed.`,
      type: 'CANCELLATION'
    });

    return res.json({
      success: true,
      message: 'Booking cancelled successfully.',
      refundAmount,
      cancellationFee,
      booking
    });
  } catch (error) {
    next(error);
  }
};
