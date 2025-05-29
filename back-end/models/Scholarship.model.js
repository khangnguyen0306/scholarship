import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name: { type: String, required: true },
  value: { type: String },
  field: { type: String },
  location: { type: String },
  deadline: { type: Date },
  description: { type: String },
  detail: { type: String },
  benefits: [{ type: String }],
  applicationMethod: { type: String },
  requirements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ScholarshipRequirement' }],
}, { timestamps: true });

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
export default Scholarship; 