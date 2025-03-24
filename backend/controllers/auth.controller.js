import { generateTokenAndSetCookie } from "../lib/generateTokenAndSetCookie.js";
import User from "../models/user.model.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

//sign up
export const Signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    //check if email and password are provided
    if (!name || !username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    //check if user exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists" });

    //check if email is email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });

    //check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username already exists" });

    //check if password is atleast 6 characters long
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });

    //hash password
    const salt = await bcryptjs.genSalt(10); // 10 rounds of hashing
    const hashedPassword = await bcryptjs.hash(password, salt);

    //generate a verification code
    const verificationToken = Math.floor( 100000 + Math.random() * 900000).toString();

    //create user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //expires in 24 hours
    });

    

    //check if new user is saved
    if (newUser) {

      //generate token and set cookie
      generateTokenAndSetCookie(newUser._id, res);

      //send verification email
    await sendVerificationEmail(newUser.email, verificationToken, newUser.name);

      //save user
      await newUser.save();

      return res.status(201).json({
        success: true,
        message: "User Registered successfully, please check your email to verify your account",
        user: {
          ...newUser._doc,
          password: undefined,
        },
      });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};










//sign in
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if email and password are provided
    if (!email || !password)return res.status(400).json({ message: "Please provide email and password" });

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    //check if user is verified
    if (!user.isVerified)
      return res.status(400).json({
        message: "Please verify your account, check your email for the verification token",
      });

    //check if password is correct
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid password" });

     //update user last login
     user.lastLogin = new Date();
     await user.save();

    //generate token and set cookie
    generateTokenAndSetCookie(user._id, res);
    return res.status(200).json({
      success: true,
      message: "User Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};



export const verifyEmail = async(req, res)=>{
    try {
      

        const {code} =  req.body;
//get verification code
        if(!code) return res.status(400).json({message: "Please provide a verification code"});


        //find user with verification code
        const user = await User.findOne({verificationToken: code, verificationExpiresAt: {$gt: Date.now()}});

        //check if verufication code is valid
        if(!user) return res.status(400).json({message: "Invalid or expired verification code"});

        //update user isVerified to true
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;
        await user.save();

        //send a welcome email

        return res.status(200).json({message: "Email verified successfully", user: {...user._doc, password: undefined}});

        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
}


//sign out
export const Logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};








//forgot password
export const ForgotPassword = async (req, res) => {};
//reset password
export const ResetPassword = async (req, res) => {};
