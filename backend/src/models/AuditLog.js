const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    targetResource: { type: String, required: true },
    targetId: { type: String, default: '' },
    details: { type: String, default: '' },
    ipAddress: { type: String, default: '127.0.0.1' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
