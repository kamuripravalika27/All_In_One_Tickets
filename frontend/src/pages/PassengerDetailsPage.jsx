import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import api from '../services/api';
import { Users, Mail, Phone, Tag, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

const PassengerDetailsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedTransport, searchQuery, selectedSeats, boardingPoint, droppingPoint } = useBooking();

  const [passengers, setPassengers] = useState([
    { name: user?.name || '', age: '', gender: 'Male', berthPreference: 'No Preference' }
  ]);
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedTransport) {
      navigate('/');
    }
  }, [selectedTransport, navigate]);

  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      alert('Maximum 6 passengers allowed per booking.');
      return;
    }
    setPassengers([...passengers, { name: '', age: '', gender: 'Male', berthPreference: 'No Preference' }]);
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode) return;
    try {
      const baseFare = (selectedTransport?.fare || 1000) * passengers.length;
      const res = await api.post('/coupons/validate', { code: couponCode, amount: baseFare });
      if (res.success) {
        setAppliedCoupon(res.coupon);
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid promo code');
    }
  };

  // Fare calculations
  const passengerCount = passengers.length;
  const basePricePerPerson = selectedTransport?.fare || 1000;
  const totalBaseFare = basePricePerPerson * passengerCount;
  const totalTaxes = Math.round(totalBaseFare * 0.05);
  const serviceFee = 20;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, totalBaseFare + totalTaxes + serviceFee - discountAmount);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validation
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name || !passengers[i].age) {
        setSubmitError(`Please fill in Name and Age for Passenger ${i + 1}.`);
        return;
      }
    }

    if (!contactEmail || !contactPhone) {
      setSubmitError('Please enter valid contact Email and Phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/bookings/create', {
        transportType: selectedTransport.transportType || searchQuery.mode,
        transportId: selectedTransport._id,
        passengers,
        contactEmail,
        contactPhone,
        travelClass: selectedTransport.selectedClass || selectedTransport.busType || '3AC',
        seatNumbers: selectedSeats,
        journeyDate: searchQuery.date,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        boardingPoint,
        droppingPoint
      });

      if (res.success) {
        navigate(`/payment-checkout/${res.booking._id}`);
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to create booking reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedTransport) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
        <ArrowLeft className="w-4 h-4" /> Back to Selection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Column */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-brand-sky" /> Passenger Information
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Enter details for all travelers as per government photo ID proof.
              </p>
            </div>

            {submitError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" /> {submitError}
              </div>
            )}

            {/* Passenger Rows */}
            {passengers.map((passenger, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-base">Passenger {index + 1}</h4>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(index)}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-sky"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
                    <input
                      type="number"
                      placeholder="Age"
                      min="1"
                      max="110"
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-sky"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                    <select
                      value={passenger.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {selectedTransport.transportType === 'train' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Berth Preference</label>
                    <select
                      value={passenger.berthPreference}
                      onChange={(e) => handlePassengerChange(index, 'berthPreference', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold"
                    >
                      <option value="No Preference">No Preference</option>
                      <option value="Lower Berth">Lower Berth</option>
                      <option value="Middle Berth">Middle Berth</option>
                      <option value="Upper Berth">Upper Berth</option>
                      <option value="Side Lower">Side Lower</option>
                      <option value="Side Upper">Side Upper</option>
                    </select>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddPassenger}
              className="w-full py-3 rounded-2xl bg-sky-50 text-brand-sky border border-brand-sky/30 font-bold text-sm hover:bg-sky-100 transition-all"
            >
              + Add Another Passenger
            </button>

            {/* Contact Details */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-900 text-base">Booking Confirmation Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile Phone</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-sky to-blue-600 text-white font-black text-lg shadow-xl hover:shadow-glow transition-all"
            >
              {isSubmitting ? 'Creating Booking Reservation...' : 'Proceed to Payment Checkout'}
            </button>

          </form>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          
          {/* Selected Transport Summary */}
          <div className="bg-brand-navy text-white rounded-3xl p-6 shadow-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-brand-sky text-xs font-bold uppercase tracking-wider">
              {selectedTransport.transportType || searchQuery.mode} Ticket
            </span>
            <h3 className="text-xl font-black">{selectedTransport.trainName || selectedTransport.airlineName || selectedTransport.operatorName}</h3>
            <p className="text-xs text-slate-300">
              {selectedTransport.sourceCity} → {selectedTransport.destinationCity}
            </p>
            <div className="pt-2 border-t border-slate-800 text-xs space-y-1 text-slate-400">
              <p>Departure: <strong className="text-white">{selectedTransport.departureTime}</strong></p>
              <p>Date: <strong className="text-white">{searchQuery.date}</strong></p>
              <p>Class: <strong className="text-white">{selectedTransport.selectedClass || 'Standard'}</strong></p>
              {selectedSeats.length > 0 && <p>Seats: <strong className="text-brand-sky">{selectedSeats.join(', ')}</strong></p>}
            </div>
          </div>

          {/* Promo Coupon Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-sky" /> Apply Promo Code
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Code (e.g. ONETRIP150)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-brand-navy text-white rounded-xl text-xs font-bold"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-xs font-bold text-emerald-600">
                ✓ Promo code '{appliedCoupon.code}' applied! Saved ₹{appliedCoupon.discountAmount}.
              </p>
            )}
            {couponError && <p className="text-xs font-bold text-rose-600">{couponError}</p>}
          </div>

          {/* Fare Summary Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 text-sm">
            <h4 className="font-black text-slate-900 border-b pb-2">Fare Breakdown</h4>
            <div className="flex justify-between text-slate-600">
              <span>Base Fare ({passengerCount} x ₹{basePricePerPerson}):</span>
              <span className="font-bold">₹{totalBaseFare}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes & GST (5%):</span>
              <span className="font-bold">₹{totalTaxes}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Convenience Fee:</span>
              <span className="font-bold">₹{serviceFee}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount:</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t">
              <span>Total Payable:</span>
              <span className="text-brand-blue">₹{finalTotal}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PassengerDetailsPage;
