import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Activity } from 'lucide-react';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/audit-logs');
        if (res.success) setLogs(res.logs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-500" /> Admin Audit Logs
        </h1>
        <p className="text-xs text-slate-500">Security event history for admin CRUD operations and booking updates.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Admin Email</th>
              <th className="p-4">Action</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-800 text-xs">
            {logs.map((l) => (
              <tr key={l._id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-400">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="p-4 font-bold">{l.adminEmail}</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded bg-slate-100 font-bold">{l.action}</span></td>
                <td className="p-4 text-slate-600">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
