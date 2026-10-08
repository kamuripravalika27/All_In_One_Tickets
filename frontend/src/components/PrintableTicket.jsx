import React, { useRef } from 'react';
import { Compass, Printer, Download, CheckCircle2, QrCode, AlertTriangle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PrintableTicket = ({ booking }) => {
  const ticketRef = useRef(null);

  if (!booking) return null;

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    try {
      const canvas = await html2canvas(ticketRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`OneTrip-Ticket-${booking.bookingRef}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Failed to generate PDF. Printing directly...');
      window.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-lg">
        <div>
          <p className="text-sm font-bold">Demo Ticket / PNR Itinerary</p>
          <p className="text-xs text-slate-400">Ref: #{booking.bookingRef}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Ticket
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2 rounded-xl bg-brand-sky hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-4 h-4" /> Download PDF Ticket
          </button>
        </div>
      </div>

      {/* Printable Ticket Container */}
      <div
        ref={ticketRef}
        className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-2xl space-y-6 text-slate-900 font-sans"
      >
        {/* Ticket Header */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy flex items-center justify-center">
              <Compass className="w-7 h-7 text-brand-sky" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">One<span className="text-brand-sky">Trip</span></span>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">E-Ticket & Travel Itinerary</p>
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-300">
              {booking.bookingStatus}
            </span>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Payment: <strong className="text-emerald-600">{booking.paymentStatus}</strong>
            </p>
          </div>
        </div>

        {/* PNR & Ref Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Booking Reference</p>
            <p className="text-base font-black text-slate-900">{booking.bookingRef}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Demo PNR</p>
            <p className="text-base font-black text-brand-blue">{booking.PNR}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Journey Date</p>
            <p className="text-base font-black text-slate-900">{booking.snapshot?.journeyDate}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Mode / Class</p>
            <p className="text-base font-black text-slate-900 uppercase">{booking.transportType} ({booking.snapshot?.travelClass})</p>
          </div>
        </div>

        {/* Transport & Route Info */}
        <div className="bg-gradient-to-r from-slate-900 to-brand-navy text-white rounded-2xl p-6 shadow-md">
          <div className="flex justify-between items-center pb-4 border-b border-slate-700">
            <div>
              <p className="text-xs text-brand-sky font-bold uppercase tracking-wider">{booking.transportType} Details</p>
              <h3 className="text-xl font-black">{booking.snapshot?.transportName}</h3>
              <p className="text-xs text-slate-300 font-semibold">Service #{booking.snapshot?.transportNumber}</p>
            </div>
            <div className="text-right">
              <QrCode className="w-12 h-12 text-white/80" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 text-center items-center">
            <div className="text-left">
              <p className="text-2xl font-black">{booking.snapshot?.departureTime}</p>
              <p className="text-sm font-bold text-brand-sky">{booking.snapshot?.sourceCity}</p>
              <p className="text-[11px] text-slate-300 truncate">{booking.snapshot?.departureStation}</p>
            </div>

            <div className="text-center">
              <p className="text-xs font-bold text-slate-400">{booking.snapshot?.duration || 'Direct'}</p>
              <div className="w-full flex items-center my-1">
                <div className="h-2 w-2 rounded-full bg-brand-sky"></div>
                <div className="h-0.5 flex-1 bg-slate-600"></div>
                <div className="h-2 w-2 rounded-full bg-brand-sky"></div>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Confirmed</span>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black">{booking.snapshot?.arrivalTime}</p>
              <p className="text-sm font-bold text-brand-sky">{booking.snapshot?.destinationCity}</p>
              <p className="text-[11px] text-slate-300 truncate">{booking.snapshot?.arrivalStation}</p>
            </div>
          </div>
        </div>

        {/* Passenger Manifest Table */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Passenger Manifest</h4>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Passenger Name</th>
                  <th className="p-3">Age / Gender</th>
                  <th className="p-3">Seat / Berth</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {booking.passengers?.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold">{p.name}</td>
                    <td className="p-3">{p.age} Yrs / {p.gender}</td>
                    <td className="p-3 text-brand-blue font-bold">{p.seatNumber || booking.seatNumbers?.[idx] || p.berthPreference || 'Assigned at Station'}</td>
                    <td className="p-3 text-emerald-600 font-bold">Confirmed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fare Summary & Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Info</h4>
            <p className="text-sm font-bold text-slate-800">{booking.contactEmail}</p>
            <p className="text-xs font-semibold text-slate-500">Phone: {booking.contactPhone}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Base Fare:</span>
              <span className="font-bold">₹{booking.totalBaseFare}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes & GST (5%):</span>
              <span className="font-bold">₹{booking.totalTaxes}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Convenience Fee:</span>
              <span className="font-bold">₹{booking.serviceFee}</span>
            </div>
            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount ({booking.couponCode}):</span>
                <span>-₹{booking.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid:</span>
              <span className="text-brand-blue">₹{booking.finalAmount}</span>
            </div>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>Notice: This document is a simulated DEMO reservation generated on OneTrip. It is not an official IRCTC or airline PNR ticket.</span>
        </div>

      </div>
    </div>
  );
};

export default PrintableTicket;
