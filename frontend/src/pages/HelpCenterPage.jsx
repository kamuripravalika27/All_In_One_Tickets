import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { HelpCircle, Mail, Phone, MapPin, ChevronDown, Send, CheckCircle2 } from 'lucide-react';

const HelpCenterPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const [ticketForm, setTicketForm] = useState({ name: '', email: '', subject: '', message: '', bookingRef: '' });
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [ticketError, setTicketError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const faqRes = await api.get('/support/faqs');
        if (faqRes.success) setFaqs(faqRes.faqs);

        const contactRes = await api.get('/support/contact');
        if (contactRes.success) setContactInfo(contactRes.contact);
      } catch (err) {
        console.error('Support data fetch error:', err.message);
      }
    };
    fetchSupportData();
  }, []);

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setTicketSuccess('');
    setTicketError('');
    setSubmitting(true);

    try {
      const res = await api.post('/support/ticket', ticketForm);
      if (res.success) {
        setTicketSuccess(res.message);
        setTicketForm({ name: '', email: '', subject: '', message: '', bookingRef: '' });
      }
    } catch (err) {
      setTicketError(err.message || 'Failed to submit support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      
      {/* Header */}
      <div className="bg-brand-navy text-white p-8 rounded-3xl shadow-xl text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-sky flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-black">Help Center & Customer Support</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Find instant answers to common questions or submit a ticket to our 24x7 helpdesk.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 border-b pb-3">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 font-bold text-slate-900 text-base flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-slate-600 text-sm border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form & Information */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Submit Ticket Form */}
        <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900">Submit Support Ticket</h3>

          {ticketSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> {ticketSuccess}
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  value={ticketForm.name}
                  onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={ticketForm.email}
                  onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Booking query / Cancellation"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Booking Ref (Optional)</label>
                <input
                  type="text"
                  placeholder="OTB-123456"
                  value={ticketForm.bookingRef}
                  onChange={(e) => setTicketForm({ ...ticketForm, bookingRef: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message Details</label>
              <textarea
                rows="4"
                placeholder="Describe your issue or question in detail..."
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-semibold focus:outline-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

        {/* Contact Info Card */}
        <div className="md:col-span-5 bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
          <h3 className="text-xl font-black">Customer Care Desk</h3>
          
          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-sky shrink-0" />
              <div>
                <p className="font-bold text-white">Email Address</p>
                <p>{contactInfo?.email || 'support@onetrip-demo.com'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-sky shrink-0" />
              <div>
                <p className="font-bold text-white">Working Hours</p>
                <p>{contactInfo?.hours || '24x7 Customer Helpdesk'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-sky shrink-0" />
              <div>
                <p className="font-bold text-white">Office Location</p>
                <p>{contactInfo?.location || 'OneTrip Tech Pvt Ltd, Hitec City, Hyderabad'}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-[11px] text-amber-300 space-y-1">
            <p className="font-bold">⚠️ Configurable Settings Notice:</p>
            <p>{contactInfo?.notice || 'Contact details are configured for demo environment.'}</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default HelpCenterPage;
