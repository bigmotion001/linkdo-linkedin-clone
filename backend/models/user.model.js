import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    profileImg: {
      type: String,
      default: "",
    },
    bannerImg: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "Linkdo User",
    },
    location: {
      type: String,
      default: "Earth",
    },
    about: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastLogin:{
      type:Date,
      default:Date.now
  },
  isVerified:{
      type:Boolean,
      default:false
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken:String,
  verificationExpiresAt:Date,





  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
