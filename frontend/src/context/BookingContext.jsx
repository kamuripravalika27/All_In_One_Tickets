import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState({
    mode: 'train', // train, flight, bus
    from: 'Hyderabad',
    to: 'Vijayawada',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    returnDate: '',
    tripType: 'oneway',
    passengersCount: 1,
    travelClass: '3AC'
  });

  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [boardingPoint, setBoardingPoint] = useState('');
  const [droppingPoint, setDroppingPoint] = useState('');
  const [draftPassengers, setDraftPassengers] = useState([
    { name: '', age: '', gender: 'Male', berthPreference: 'No Preference' }
  ]);

  const updateSearchQuery = (updates) => {
    setSearchQuery((prev) => ({ ...prev, ...updates }));
  };

  const resetBookingDraft = () => {
    setSelectedTransport(null);
    setSelectedSeats([]);
    setBoardingPoint('');
    setDroppingPoint('');
    setDraftPassengers([{ name: '', age: '', gender: 'Male', berthPreference: 'No Preference' }]);
  };

  return (
    <BookingContext.Provider
      value={{
        searchQuery,
        updateSearchQuery,
        selectedTransport,
        setSelectedTransport,
        selectedSeats,
        setSelectedSeats,
        boardingPoint,
        setBoardingPoint,
        droppingPoint,
        setDroppingPoint,
        draftPassengers,
        setDraftPassengers,
        resetBookingDraft
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
