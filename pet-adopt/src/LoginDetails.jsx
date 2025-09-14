import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { getCurrentUser, setCurrentUser } from '../userc.js';

const CONTRACT_ADDRESS = "0x567E78dd771283A44DF7e65211f3766Bb879d5e2";
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"petId","type":"string"}],"name":"NFTRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"petId","type":"string"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"PetAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"petId","type":"string"},{"indexed":false,"internalType":"address","name":"adopter","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"donation","type":"uint256"}],"name":"PetAdopted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"petId","type":"string"}],"name":"PetRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"petId","type":"string"},{"indexed":false,"internalType":"string","name":"name","type":"string"}],"name":"PetUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"UserBanned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"string","name":"role","type":"string"},{"indexed":false,"internalType":"uint256","name":"expiry","type":"uint256"},{"indexed":false,"internalType":"string","name":"digitalId","type":"string"}],"name":"UserRegistered","type":"event"},{"inputs":[{"internalType":"string","name":"_petId","type":"string"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_breed","type":"string"},{"internalType":"uint256","name":"_age","type":"uint256"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"string","name":"_image","type":"string"}],"name":"addPet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_petId","type":"string"}],"name":"adoptPet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"adoptionFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"banUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"digitalIdToAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_digitalId","type":"string"}],"name":"getAddressByDigitalId","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllPets","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_petId","type":"string"}],"name":"getPet","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"","type":"address"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nftToPetId","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"petIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"pets","outputs":[{"internalType":"string","name":"petId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"breed","type":"string"},{"internalType":"uint256","name":"age","type":"uint256"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"image","type":"string"},{"internalType":"address","name":"petOwner","type":"address"},{"internalType":"bool","name":"available","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_digitalId","type":"string"},{"internalType":"string","name":"_role","type":"string"}],"name":"registerUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_petId","type":"string"}],"name":"removePet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"revokeNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"siteOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_petId","type":"string"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_breed","type":"string"},{"internalType":"uint256","name":"_age","type":"uint256"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"string","name":"_image","type":"string"}],"name":"updatePet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"string","name":"role","type":"string"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"bool","name":"verified","type":"bool"},{"internalType":"bool","name":"banned","type":"bool"},{"internalType":"string","name":"digitalId","type":"string"}],"stateMutability":"view","type":"function"}]
;
export default function LoginDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role"); // adopter or admin
  const alreadyRegistered = queryParams.get("alreadyRegistered") === "true";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    aadhaarLast4: "",
    otp: "",
    wallet: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // === Send OTP to backend ===
  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email first!");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:3000/send-email-otp", {
        email: formData.email,
      });
      setOtpSent(true);
      alert("OTP sent to your email!");
    } catch (err) {
      alert("Failed to send OTP: " + err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  // === Register on blockchain ===
  const registerOnChain = async (digitalId) => {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // request wallet access
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const roleStr = role === "adopter" ? "adopter" : "admin";
  const tx = await contract.registerUser(digitalId, roleStr);
      await tx.wait();
      alert("✅ Registered on blockchain successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Blockchain registration failed: " + err.message);
    }
  };

  // === Submit form ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let digitalId;

      if (alreadyRegistered) {
        // Skip OTP verification, generate digital ID
        digitalId = formData.aadhaarLast4 + "_" + formData.email;
        alert(`Using existing Digital ID: ${digitalId}`);
      } else {
        // Normal OTP verification flow
        const res = await axios.post("http://localhost:3000/verify-email-otp", {
          aadhaar: formData.aadhaarLast4,
          mobile: formData.phone,
          email: formData.email,
          otp: formData.otp,
          role,
          wallet: formData.wallet,
        });
        digitalId = res.data.digitalId;
        alert(`✅ Verified! Digital ID: ${digitalId}`);
        console.log("Token:", res.data.token);
          await registerOnChain(digitalId);
      }

      // Register on-chain
    

      // Navigate to main dashboard / website
      navigate(`/dashboard?digitalId=${digitalId}`);
    } catch (err) {
      alert("Failed: " + err.response?.data?.msg || err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2 style={{ fontSize: "28px", marginBottom: "30px", color: "#ff6f61" }}>
        Fill Your Details 🐾
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "320px",
          backgroundColor: "#fefefe",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        {/* Full Name */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Phone Number */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Aadhaar Last 4 digits */}
        <input
          type="text"
          name="aadhaarLast4"
          placeholder="Last 4 digits of Aadhaar"
          value={formData.aadhaarLast4}
          onChange={handleChange}
          maxLength="4"
          required
          style={inputStyle}
        />

        {/* Wallet Address */}
        <input
          type="text"
          name="wallet"
          placeholder="Wallet Address (0x...)"
          value={formData.wallet}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Send OTP button (only if not already registered) */}
        {!alreadyRegistered && (
          <motion.button
            type="button"
            onClick={handleSendOtp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "10px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#ff9800",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
          </motion.button>
        )}

        {/* OTP Input */}
        {!alreadyRegistered && otpSent && (
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            maxLength="6"
            required
            style={inputStyle}
          />
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#6c63ff",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {alreadyRegistered ? "Continue" : "Verify & Continue"}
        </motion.button>
      </form>
    </div>
  );
}

// === Common Input Style ===
const inputStyle = {
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "15px",
  transition: "0.2s",
};