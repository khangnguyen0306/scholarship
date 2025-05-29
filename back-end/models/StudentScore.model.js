import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  certificateType: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateType' },
  score: { type: Number },
  date: { type: Date }
}, { _id: false });

const studentScoreSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  grade10: { type: Number },
  grade11: { type: Number },
  grade12: { type: Number },
  certificates: [certificateSchema],
}, { timestamps: true });

const StudentScore = mongoose.model('StudentScore', studentScoreSchema);
export default StudentScore; 