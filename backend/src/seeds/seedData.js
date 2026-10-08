const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const User = require('../models/User');
const Train = require('../models/Train');
const Flight = require('../models/Flight');
const Bus = require('../models/Bus');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to database. Cleaning old data...');

    await User.deleteMany({});
    await Train.deleteMany({});
    await Flight.deleteMany({});
    await Bus.deleteMany({});
    await Coupon.deleteMany({});
    await Review.deleteMany({});

    console.log('[Seed] Creating Admin & Customer users...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@onetrip.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@OneTrip2026';

    const adminUser = await User.create({
      name: 'OneTrip Admin',
      email: adminEmail,
      phone: '9999988888',
      password: adminPassword,
      role: 'admin'
    });

    const demoCustomer = await User.create({
      name: 'Rahul Sharma',
      email: 'customer@onetrip.com',
      phone: '9876543210',
      password: 'User@OneTrip2026',
      role: 'customer'
    });

    console.log(`[Seed] Admin Created: ${adminEmail} | Password: ${adminPassword}`);
    console.log(`[Seed] Customer Created: customer@onetrip.com | Password: User@OneTrip2026`);

    console.log('[Seed] Inserting Indian Train routes & services...');
    await Train.insertMany([
      {
        trainNumber: '12760',
        trainName: 'Charminar Superfast Express',
        sourceCity: 'Hyderabad',
        destinationCity: 'Chennai',
        departureStation: 'Secunderabad Junction (SC)',
        arrivalStation: 'Chennai Central (MAS)',
        departureTime: '06:00 PM',
        arrivalTime: '08:15 AM',
        duration: '14h 15m',
        runningDays: ['Daily'],
        classes: [
          { className: '1st AC (1AC)', code: '1AC', fare: 2850, seatsAvailable: 12 },
          { className: '2nd AC (2AC)', code: '2AC', fare: 1720, seatsAvailable: 28 },
          { className: '3rd AC (3AC)', code: '3AC', fare: 1210, seatsAvailable: 45 },
          { className: 'Sleeper (SL)', code: 'SL', fare: 480, seatsAvailable: 80 }
        ]
      },
      {
        trainNumber: '12728',
        trainName: 'Godavari Superfast Express',
        sourceCity: 'Hyderabad',
        destinationCity: 'Visakhapatnam',
        departureStation: 'Hyderabad Deccan (HYB)',
        arrivalStation: 'Visakhapatnam Junction (VSKP)',
        departureTime: '05:15 PM',
        arrivalTime: '05:50 AM',
        duration: '12h 35m',
        runningDays: ['Daily'],
        classes: [
          { className: '1st AC (1AC)', code: '1AC', fare: 2600, seatsAvailable: 8 },
          { className: '2nd AC (2AC)', code: '2AC', fare: 1580, seatsAvailable: 34 },
          { className: '3rd AC (3AC)', code: '3AC', fare: 1100, seatsAvailable: 62 },
          { className: 'Sleeper (SL)', code: 'SL', fare: 420, seatsAvailable: 120 }
        ]
      },
      {
        trainNumber: '12026',
        trainName: 'Pune - Secunderabad Shatabdi Express',
        sourceCity: 'Pune',
        destinationCity: 'Hyderabad',
        departureStation: 'Pune Junction (PUNE)',
        arrivalStation: 'Secunderabad Junction (SC)',
        departureTime: '06:00 AM',
        arrivalTime: '02:20 PM',
        duration: '8h 20m',
        runningDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: [
          { className: 'Executive Chair (EC)', code: 'EC', fare: 2150, seatsAvailable: 18 },
          { className: 'AC Chair Car (CC)', code: 'CC', fare: 1140, seatsAvailable: 75 }
        ]
      },
      {
        trainNumber: '12626',
        trainName: 'Kerala Vande Bharat Express',
        sourceCity: 'Bengaluru',
        destinationCity: 'Chennai',
        departureStation: 'KSR Bengaluru (SBC)',
        arrivalStation: 'Chennai Central (MAS)',
        departureTime: '05:45 AM',
        arrivalTime: '10:15 AM',
        duration: '4h 30m',
        runningDays: ['Daily'],
        classes: [
          { className: 'Executive Chair (EC)', code: 'EC', fare: 2200, seatsAvailable: 24 },
          { className: 'AC Chair Car (CC)', code: 'CC', fare: 1250, seatsAvailable: 90 }
        ]
      },
      {
        trainNumber: '12951',
        trainName: 'Rajdhani Express',
        sourceCity: 'Mumbai',
        destinationCity: 'Delhi',
        departureStation: 'Mumbai Central (MMCT)',
        arrivalStation: 'New Delhi (NDLS)',
        departureTime: '05:00 PM',
        arrivalTime: '08:32 AM',
        duration: '15h 32m',
        runningDays: ['Daily'],
        classes: [
          { className: '1st AC (1AC)', code: '1AC', fare: 4850, seatsAvailable: 15 },
          { className: '2nd AC (2AC)', code: '2AC', fare: 2980, seatsAvailable: 42 },
          { className: '3rd AC (3AC)', code: '3AC', fare: 2150, seatsAvailable: 68 }
        ]
      },
      {
        trainNumber: '12763',
        trainName: 'Padmavati Express',
        sourceCity: 'Tirupati',
        destinationCity: 'Hyderabad',
        departureStation: 'Tirupati Main (TPTY)',
        arrivalStation: 'Secunderabad Junction (SC)',
        departureTime: '05:00 PM',
        arrivalTime: '05:55 AM',
        duration: '12h 55m',
        runningDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
        classes: [
          { className: '2nd AC (2AC)', code: '2AC', fare: 1650, seatsAvailable: 20 },
          { className: '3rd AC (3AC)', code: '3AC', fare: 1150, seatsAvailable: 50 },
          { className: 'Sleeper (SL)', code: 'SL', fare: 430, seatsAvailable: 110 }
        ]
      },
      {
        trainNumber: '12711',
        trainName: 'Pinakini Superfast Express',
        sourceCity: 'Vijayawada',
        destinationCity: 'Chennai',
        departureStation: 'Vijayawada Junction (BZA)',
        arrivalStation: 'Chennai Central (MAS)',
        departureTime: '06:10 AM',
        arrivalTime: '01:00 PM',
        duration: '6h 50m',
        runningDays: ['Daily'],
        classes: [
          { className: 'AC Chair Car (CC)', code: 'CC', fare: 780, seatsAvailable: 48 },
          { className: '2nd Seating (2S)', code: '2S', fare: 210, seatsAvailable: 150 }
        ]
      }
    ]);

    console.log('[Seed] Inserting Flight schedules...');
    await Flight.insertMany([
      {
        flightNumber: '6E-481',
        airlineName: 'IndiGo',
        airlineCode: '6E',
        logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&auto=format&fit=crop&q=80',
        sourceCity: 'Hyderabad',
        destinationCity: 'Bengaluru',
        sourceAirport: 'Rajiv Gandhi Intl (HYD)',
        destinationAirport: 'Kempegowda Intl (BLR)',
        departureTime: '07:30 AM',
        arrivalTime: '08:45 AM',
        duration: '1h 15m',
        stops: 0,
        runningDays: ['Daily'],
        classes: [
          { className: 'Economy', fare: 3499, seatCount: 90 },
          { className: 'Business', fare: 8999, seatCount: 12 }
        ]
      },
      {
        flightNumber: 'UK-815',
        airlineName: 'Vistara',
        airlineCode: 'UK',
        logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=80',
        sourceCity: 'Delhi',
        destinationCity: 'Mumbai',
        sourceAirport: 'Indira Gandhi Intl (DEL)',
        destinationAirport: 'Chhatrapati Shivaji Intl (BOM)',
        departureTime: '10:00 AM',
        arrivalTime: '12:15 PM',
        duration: '2h 15m',
        stops: 0,
        runningDays: ['Daily'],
        classes: [
          { className: 'Economy', fare: 4890, seatCount: 120 },
          { className: 'Premium Economy', fare: 7490, seatCount: 24 },
          { className: 'Business', fare: 16500, seatCount: 16 }
        ]
      },
      {
        flightNumber: 'AI-542',
        airlineName: 'Air India',
        airlineCode: 'AI',
        logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&auto=format&fit=crop&q=80',
        sourceCity: 'Hyderabad',
        destinationCity: 'Vijayawada',
        sourceAirport: 'Rajiv Gandhi Intl (HYD)',
        destinationAirport: 'Vijayawada Intl (VGA)',
        departureTime: '04:15 PM',
        arrivalTime: '05:10 PM',
        duration: '55m',
        stops: 0,
        runningDays: ['Mon', 'Wed', 'Fri', 'Sun'],
        classes: [
          { className: 'Economy', fare: 2490, seatCount: 70 }
        ]
      },
      {
        flightNumber: 'QP-1302',
        airlineName: 'Akasa Air',
        airlineCode: 'QP',
        logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=80',
        sourceCity: 'Bengaluru',
        destinationCity: 'Chennai',
        sourceAirport: 'Kempegowda Intl (BLR)',
        destinationAirport: 'Chennai Intl (MAA)',
        departureTime: '02:00 PM',
        arrivalTime: '03:00 PM',
        duration: '1h 00m',
        stops: 0,
        runningDays: ['Daily'],
        classes: [
          { className: 'Economy', fare: 2899, seatCount: 85 }
        ]
      },
      {
        flightNumber: '6E-672',
        airlineName: 'IndiGo',
        airlineCode: '6E',
        logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&auto=format&fit=crop&q=80',
        sourceCity: 'Visakhapatnam',
        destinationCity: 'Hyderabad',
        sourceAirport: 'Visakhapatnam Intl (VTZ)',
        destinationAirport: 'Rajiv Gandhi Intl (HYD)',
        departureTime: '08:50 PM',
        arrivalTime: '10:00 PM',
        duration: '1h 10m',
        stops: 0,
        runningDays: ['Daily'],
        classes: [
          { className: 'Economy', fare: 3199, seatCount: 75 }
        ]
      }
    ]);

    console.log('[Seed] Inserting Bus services...');
    await Bus.insertMany([
      {
        busNumber: 'AP-29-Z-1008',
        operatorName: 'Orange Tours & Travels',
        busType: 'Volvo AC Multi-Axle Sleeper',
        totalSeats: 36,
        sourceCity: 'Hyderabad',
        destinationCity: 'Vijayawada',
        boardingPoints: [
          { station: 'Ameerpet (09:30 PM)', time: '09:30 PM' },
          { station: 'LB Nagar (10:15 PM)', time: '10:15 PM' }
        ],
        droppingPoints: [
          { station: 'RTC Bus Stand Vijayawada', time: '04:00 AM' },
          { station: 'Benz Circle', time: '04:20 AM' }
        ],
        departureTime: '09:30 PM',
        arrivalTime: '04:00 AM',
        duration: '6h 30m',
        fare: 890,
        rating: 4.8,
        amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Reading Light', 'Live Tracking']
      },
      {
        busNumber: 'KA-01-F-4020',
        operatorName: 'KSRTC Swift Volvos',
        busType: 'AC Sleeper (2+1)',
        totalSeats: 30,
        sourceCity: 'Bengaluru',
        destinationCity: 'Hyderabad',
        boardingPoints: [
          { station: 'Majestic Bus Stand', time: '10:00 PM' },
          { station: 'Hebbal', time: '10:45 PM' }
        ],
        droppingPoints: [
          { station: 'Shamshabad', time: '05:30 AM' },
          { station: 'MGBS Hyderabad', time: '06:15 AM' }
        ],
        departureTime: '10:00 PM',
        arrivalTime: '06:15 AM',
        duration: '8h 15m',
        fare: 1150,
        rating: 4.7,
        amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket']
      },
      {
        busNumber: 'TN-09-B-7711',
        operatorName: 'VRL Travels',
        busType: 'AC Seater (2+2)',
        totalSeats: 40,
        sourceCity: 'Chennai',
        destinationCity: 'Bengaluru',
        boardingPoints: [
          { station: 'Koyambedu', time: '11:00 PM' }
        ],
        droppingPoints: [
          { station: 'Electronic City', time: '05:00 AM' },
          { station: 'KSRTC Satellite Stand', time: '05:45 AM' }
        ],
        departureTime: '11:00 PM',
        arrivalTime: '05:45 AM',
        duration: '6h 45m',
        fare: 650,
        rating: 4.6,
        amenities: ['Charging Point', 'Water Bottle', 'Reclining Seats']
      },
      {
        busNumber: 'MH-12-Q-3390',
        operatorName: 'Neeta Tours and Travels',
        busType: 'Volvo AC Multi-Axle Sleeper',
        totalSeats: 36,
        sourceCity: 'Mumbai',
        destinationCity: 'Pune',
        boardingPoints: [
          { station: 'Dadar East', time: '07:00 AM' },
          { station: 'Vashi Expressway', time: '07:50 AM' }
        ],
        droppingPoints: [
          { station: 'Wakad Bridge', time: '10:00 AM' },
          { station: 'Swargate', time: '10:45 AM' }
        ],
        departureTime: '07:00 AM',
        arrivalTime: '10:45 AM',
        duration: '3h 45m',
        fare: 450,
        rating: 4.5,
        amenities: ['Water Bottle', 'Charging Point', 'AC']
      },
      {
        busNumber: 'AP-04-T-8822',
        operatorName: 'APSRTC Amaravathi Super Deluxe',
        busType: 'AC Sleeper (2+1)',
        totalSeats: 30,
        sourceCity: 'Hyderabad',
        destinationCity: 'Tirupati',
        boardingPoints: [
          { station: 'MGBS Bus Stand', time: '08:00 PM' }
        ],
        droppingPoints: [
          { station: 'Tirupati RTC Bus Stand', time: '06:00 AM' }
        ],
        departureTime: '08:00 PM',
        arrivalTime: '06:00 AM',
        duration: '10h 00m',
        fare: 1280,
        rating: 4.9,
        amenities: ['WiFi', 'Blanket', 'Water Bottle', 'Live Tracking']
      }
    ]);

    console.log('[Seed] Inserting Promotional Coupons...');
    await Coupon.insertMany([
      {
        code: 'ONETRIP150',
        description: 'Get flat ₹150 off on your first booking with OneTrip',
        discountType: 'fixed',
        discountValue: 150,
        minBookingAmount: 500,
        maxDiscount: 150,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      {
        code: 'FESTIVE15',
        description: 'Get 15% instant discount on flights & train bookings up to ₹500',
        discountType: 'percentage',
        discountValue: 15,
        minBookingAmount: 1000,
        maxDiscount: 500,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      {
        code: 'BUSMAGIC',
        description: 'Flat ₹100 discount on all bus ticket bookings',
        discountType: 'fixed',
        discountValue: 100,
        minBookingAmount: 400,
        maxDiscount: 100,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('[Seed] Inserting Customer Reviews...');
    await Review.insertMany([
      {
        user: demoCustomer._id,
        userName: 'Rahul Sharma',
        transportType: 'train',
        rating: 5,
        comment: 'Booking Charminar Express via OneTrip was effortless! Clear availability and fast confirmation.',
        operatorName: 'Indian Railways'
      },
      {
        user: demoCustomer._id,
        userName: 'Priya Verma',
        transportType: 'bus',
        rating: 5,
        comment: 'The interactive bus seat selector worked brilliantly! Selected upper deck sleeper seat smoothly.',
        operatorName: 'Orange Tours'
      },
      {
        user: demoCustomer._id,
        userName: 'Anish Reddy',
        transportType: 'flight',
        rating: 4,
        comment: 'Great flight search UI. Smooth demo payment checkout process with printable PDF itinerary.',
        operatorName: 'IndiGo Airlines'
      }
    ]);

    console.log('[Seed] Database successfully populated with realistic Indian travel demo data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
