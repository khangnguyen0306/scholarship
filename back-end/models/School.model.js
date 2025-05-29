import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nationality: { type: String, required: true },
    address: { type: String, required: true },
    website: { type: String },
    description: { type: String, required: true },
    logo: { type: String },
    foundedYear: { type: Number, required: true },
    email: { type: String, required: true },
}, { timestamps: true });

const School = mongoose.model('School', schoolSchema);
export default School; 