import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useBooking } from '../context/BookingContext';
import SeatSelector from '../components/SeatSelector';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const BusDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchQuery, setSelectedTransport, setSelectedSeats, selectedSeats, boardingPoint, setBoardingPoint, droppingPoint, setDroppingPoint } = useBooking();

  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSeatLayout = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/buses/${id}/seats?date=${searchQuery.date}`);
        if (res.success) {
          setBus(res.bus);
          setSeats(res.seats || []);
          setSelectedTransport({ ...res.bus, transportType: 'bus' });
        }
      } catch (err) {
        setError(err.message || 'Failed to load bus seat layout.');
      } finally {
        setLoading(false);
      }
    };

    fetchSeatLayout();
  }, [id, searchQuery.date]);

  const handleSeatClick = (seatNo) => {
    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNo));
    } else {
      if (selectedSeats.length >= 6) {
        alert('You can select a maximum of 6 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNo]);
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }
    navigate('/passenger-details');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Bus Results
      </button>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {bus && (
        <SeatSelector
          bus={bus}
          seats={seats}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
          boardingPoint={boardingPoint}
          setBoardingPoint={setBoardingPoint}
          droppingPoint={droppingPoint}
          setDroppingPoint={setDroppingPoint}
          onProceed={handleProceed}
        />
      )}
    </div>
  );
};

export default BusDetailsPage;
