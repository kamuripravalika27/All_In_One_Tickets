import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const PaymentCheckoutPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, Card, NetBanking, Wallet, Demo
  const [simulatedResult, setSimulatedResult] = useState('SUCCESS');
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        if (res.success) {
          setBooking(res.booking);
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // Step 1: Create Payment Order
      const orderRes = await api.post('/payments/create-order', {
        bookingId,
        paymentMethod
      });

      if (orderRes.success) {
        // Step 2: Verify & Confirm Payment (Demo / Razorpay mode)
        const confirmRes = await api.post('/payments/verify-confirm', {
          paymentId: orderRes.paymentId,
          bookingId,
          paymentMethod,
          simulatedResult
        });

        if (confirmRes.success) {
          navigate(`/booking-confirmation/${bookingId}`);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment transaction failed. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-black">Booking Not Found</h3>
        <p className="text-sm text-slate-500">{errorMsg || 'Invalid booking ID.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Bar */}
      <div className="bg-brand-navy text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" /> 256-Bit SSL Encrypted Payment Checkout
          </div>
          <h1 className="text-2xl font-black mt-1">Pay ₹{booking.finalAmount}</h1>
          <p className="text-xs text-slate-300">Booking Ref: #{booking.bookingRef} • {booking.snapshot?.transportName}</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200">
          <ShieldCheck className="w-4 h-4 text-brand-sky" /> Secure Gateway
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" /> {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Payment Methods Selection */}
        <div className="md:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 border-b pb-3">Select Payment Method</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
              { id: 'Card', label: 'Card', icon: CreditCard },
              { id: 'NetBanking', label: 'Net Banking', icon: Building },
              { id: 'Wallet', label: 'Wallets', icon: Wallet }
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-brand-navy text-white border-brand-navy shadow-lg font-extrabold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-semibold'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-brand-sky' : 'text-slate-400'}`} />
                  <span className="text-xs">{method.label}</span>
                </button>
              );
            })}
          </div>

          {/* Simulated Mode Information Box */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gateway Mode</span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                DEMO PAYMENT SIMULATOR ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In Demo Mode, no real funds will be deducted from your bank account or card. You can test successful payment confirmation or simulated transaction failure below.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="simMode"
                  checked={simulatedResult === 'SUCCESS'}
                  onChange={() => setSimulatedResult('SUCCESS')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                Simulate Successful Payment
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="simMode"
                  checked={simulatedResult === 'FAILURE'}
                  onChange={() => setSimulatedResult('FAILURE')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                Simulate Payment Failure
              </label>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            onClick={handleProcessPayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-sky to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-lg shadow-xl hover:shadow-glow transition-all"
          >
            {isProcessing ? 'Verifying Payment Transaction...' : `Pay ₹${booking.finalAmount} & Confirm Booking`}
          </button>

        </div>

        {/* Right Summary */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-sm">
          <h4 className="font-black text-slate-900 border-b pb-2">Order Summary</h4>
          
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Transport:</span>
              <span className="font-bold text-slate-900">{booking.snapshot?.transportName}</span>
            </div>
            <div className="flex justify-between">
              <span>Route:</span>
              <span className="font-bold text-slate-900">{booking.snapshot?.sourceCity} → {booking.snapshot?.destinationCity}</span>
            </div>
            <div className="flex justify-between">
              <span>Passengers:</span>
              <span className="font-bold text-slate-900">{booking.passengers?.length} Person(s)</span>
            </div>
            <div className="flex justify-between">
              <span>Journey Date:</span>
              <span className="font-bold text-slate-900">{booking.snapshot?.journeyDate}</span>
            </div>
          </div>

          <div className="pt-3 border-t flex justify-between text-base font-black text-slate-900">
            <span>Total Payable:</span>
            <span className="text-brand-blue">₹{booking.finalAmount}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
            <p>🔒 256-Bit Encryption</p>
            <p>⚡ Instant PDF E-Ticket</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentCheckoutPage;
