import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const AccountSchema = new Schema({
  passwordHash: { type: String, unique: true, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  role: { type: String, enum: ["guest", "student", "mentor", "admin"], required: true, default: "student" },
  isEmailVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  emailVerificationToken: { type: String },
  profileImage: { type: String },
  isPremium: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  grades10: [{
    subject: { type: String, required: true },
    score: { type: Number, required: true }
  }],
  grades11: [{
    subject: { type: String, required: true },
    score: { type: Number, required: true }
  }],
  grades12: [{
    subject: { type: String, required: true },
    score: { type: Number, required: true }
  }],
  certificates: [{
    certificateType: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateType' },
    score: { type: Number },
    date: { type: Date }
  }],
  // Thông tin riêng cho mentor
  mentorProfile: {
    major: { type: String },
    experience: { type: String },
    bio: { type: String },
    phone: { type: String },
    degrees: [
      {
        name: { type: String },
        institution: { type: String },
        year: { type: Number }
      }
    ],
    languages: [{ type: String }],

  },
  mentorStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Gộp pre-save hook
AccountSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();

  // Chỉ hash password nếu passwordHash bị thay đổi
  if (this.isModified("passwordHash")) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

AccountSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const Auth = mongoose.model("Auth", AccountSchema);

export default Auth;
