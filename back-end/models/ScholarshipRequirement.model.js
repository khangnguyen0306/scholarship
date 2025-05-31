import mongoose from 'mongoose';

const minCertificateScoreSchema = new mongoose.Schema({
  certificateType: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateType' },
  minScore: { type: Number }
}, { _id: false });

const scholarshipRequirementSchema = new mongoose.Schema({
  minGPA: { type: Number },
  requiredCertificates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CertificateType' }],
  minCertificateScores: [minCertificateScoreSchema],
  otherConditions: { type: String }
});

const ScholarshipRequirement = mongoose.model('ScholarshipRequirement', scholarshipRequirementSchema);
export default ScholarshipRequirement; 