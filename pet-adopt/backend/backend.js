// backend/backend.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173",  // allow only your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// === MongoDB setup ===
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// === Models ===
const userSchema = new mongoose.Schema({
  aadhaarHash: String,
  mobile: String,
  email: String,
  digitalId: String,
  verified: Boolean,
  wallet: String // store user's wallet address
});
const User = mongoose.model("User", userSchema);

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date
});
const OTP = mongoose.model("OTP", otpSchema);

const petSchema = new mongoose.Schema({
  petId: String,
  name: String,
  breed: String,
  age: Number,
  description: String,
  image: String,
  ownerWallet: String,
  available: Boolean
});
const Pet = mongoose.model("Pet", petSchema);

// === Helpers ===
async function hashAadhaar(aadhaar) {
  return await bcrypt.hash(aadhaar, 10);
}

async function sendEmailOtp(email, otp) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`
  });
}

// === Blockchain setup for admin calls (server wallet) ===
const RPC_URL = process.env.SEPOLIA_RPC_URL; 
const PRIVATE_KEY = process.env.PRIVATE_KEY; 
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const CONTRACT_ABI = [
  "function banUser(address _user) public",
  "function revokeNFT(uint256 tokenId) public",
  "function getAllPets() public view returns (string[] memory)",
  "function getAddressByDigitalId(string memory _digitalId) public view returns (address)"
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// === Middleware ===
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || "SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}

// === Routes ===
// Send OTP
app.post("/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60000) });
    await sendEmailOtp(email, otp);

    res.json({ msg: "OTP sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP + Aadhaar + create digitalId
app.post("/verify-email-otp", async (req, res) => {
  try {
  const { aadhaar, mobile, email, otp, wallet } = req.body;

    const record = await OTP.findOne({ email });
    if (!record) return res.status(400).json({ msg: "No OTP found" });
    else if (record.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });
    else if (record.expiresAt < new Date()) return res.status(400).json({ msg: "OTP expired" });

    const aadhaarHash = await hashAadhaar(aadhaar);
    const digitalId = uuidv4();

    const newUser = new User({
      aadhaarHash,
      mobile,
      email,
      digitalId,
      verified: true,
      wallet: wallet || ""
    });
    await newUser.save();
    await OTP.deleteMany({ email });

    const token = jwt.sign({ digitalId }, process.env.JWT_SECRET || "SECRET_KEY", { expiresIn: "1d" });

    res.json({
      msg: "User verified on backend. Please complete on-chain registration via MetaMask",
      digitalId,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update wallet after on-chain registration
app.post("/update-wallet", authMiddleware, async (req, res) => {
  try {
    const { wallet } = req.body;
    const { digitalId } = req.user;

    const user = await User.findOneAndUpdate({ digitalId }, { wallet }, { new: true });
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "Wallet updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List pet in DB
app.post("/list-pet", async (req, res) => {
  try {
    const { petId, name, breed, age, description, image, ownerWallet } = req.body;
    const p = new Pet({ petId, name, breed, age, description, image, ownerWallet, available: true });
    await p.save();
    res.json({ msg: "Pet stored in backend DB. Owner should call contract.addPet from their wallet.", petId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: ban user
app.post("/admin/ban", async (req, res) => {
  try {
    const { userAddress } = req.body;
    const tx = await contract.banUser(userAddress);
    await tx.wait();
    res.json({ msg: "User banned on-chain", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: revoke NFT
app.post("/admin/revoke", async (req, res) => {
  try {
    const { tokenId } = req.body;
    const tx = await contract.revokeNFT(tokenId);
    await tx.wait();
    res.json({ msg: "NFT revoked on-chain", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get pets
app.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json({ pets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));