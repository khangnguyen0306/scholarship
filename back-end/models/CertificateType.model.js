import mongoose from 'mongoose';

const certificateTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  maxScore: { type: Number }
});

const CertificateType = mongoose.model('CertificateType', certificateTypeSchema);
export default CertificateType; 