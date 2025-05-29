import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  packageName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  payosOrderCode: { type: Number },
  payosTransactionId: { type: String }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription; 