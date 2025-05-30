import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  scholarship: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
  profileSnapshot: {
    grades10: [{ subject: String, score: Number }],
    grades11: [{ subject: String, score: Number }],
    grades12: [{ subject: String, score: Number }],
    certificates: [{
      certificateType: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateType' },
      score: Number,
      date: Date
    }]
  },
  documents: [{ name: String, url: String }], // array of { name, url }
  essay: { type: String },
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application; 