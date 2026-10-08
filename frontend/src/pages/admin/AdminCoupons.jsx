import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Tag, Plus, Trash2 } from 'lucide-react';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState(150);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons/active');
      if (res.success) setCoupons(res.coupons);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/coupons', {
        code,
        description: `Flat ₹${discountValue} instant discount`,
        discountType: 'fixed',
        discountValue,
        minBookingAmount: 400,
        maxDiscount: discountValue,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      });
      if (res.success) {
        setShowModal(false);
        setCode('');
        fetchCoupons();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      const res = await api.delete(`/admin/coupons/${id}`);
      if (res.success) fetchCoupons();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-amber-500" /> Promo Coupons & Offers
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-brand-sky text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative">
            <button
              onClick={() => handleDeleteCoupon(c._id)}
              className="absolute top-4 right-4 text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">{c.code}</span>
            <p className="text-xs text-slate-500">{c.description}</p>
            <p className="text-xl font-black text-slate-900">
              {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-xl font-black">Create Promo Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Coupon Code (e.g. FESTIVE200)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full p-2.5 border rounded-xl"
                required
              />
              <input
                type="number"
                placeholder="Discount Amount (e.g. 200)"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full p-2.5 border rounded-xl"
                required
              />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-100 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-brand-sky text-white font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
