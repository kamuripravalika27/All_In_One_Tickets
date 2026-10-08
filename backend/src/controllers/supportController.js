const FAQS = [
  {
    category: 'Booking & Tickets',
    question: 'How do I download my ticket / PNR itinerary?',
    answer: 'Once your payment is confirmed, go to "My Bookings" page on OneTrip, click on "View Ticket", and click the "Download PDF Ticket" button.'
  },
  {
    category: 'Booking & Tickets',
    question: 'Are demo tickets valid for actual train/flight travel?',
    answer: 'No. Demo tickets generated on OneTrip are for demonstration and educational testing. Real railway or airline travel requires official IRCTC or airline PNR integrations.'
  },
  {
    category: 'Payments & Refunds',
    question: 'What payment modes are supported?',
    answer: 'OneTrip supports UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, Net Banking, Mobile Wallets, and a instant Demo Payment simulator.'
  },
  {
    category: 'Cancellations',
    question: 'How do cancellations and refunds work?',
    answer: 'Eligible bookings can be cancelled anytime from "My Bookings". Refunds (90% of base fare) are processed automatically to your original payment mode in demo mode.'
  },
  {
    category: 'Bus Seats',
    question: 'Can I pick my exact seat layout for bus travel?',
    answer: 'Yes! OneTrip features an interactive seat layout selector showing real-time available, selected, and booked seat statuses with upper and lower deck layouts.'
  }
];

exports.getFaqs = async (req, res) => {
  return res.json({ success: true, faqs: FAQS });
};

exports.submitSupportTicket = async (req, res, next) => {
  try {
    const { name, email, subject, message, bookingRef } = req.body;
    if (!email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Email, subject, and message are required.' });
    }

    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    return res.status(201).json({
      success: true,
      message: `Support ticket #${ticketId} created successfully. Our customer support team will reply to ${email} within 24 hours.`,
      ticket: { ticketId, name, email, subject, bookingRef, createdAt: new Date() }
    });
  } catch (error) {
    next(error);
  }
};

exports.getContactInfo = async (req, res) => {
  return res.json({
    success: true,
    contact: {
      email: 'support@onetrip-demo.com',
      hours: '24x7 Customer Helpdesk',
      location: 'OneTrip Technologies Pvt Ltd, Hitec City, Hyderabad, Telangana 500081',
      notice: 'Customer support contact details are provided as configurable demo settings.'
    }
  });
};
