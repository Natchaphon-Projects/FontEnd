import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OTPLogin.css"; // ใช้ไฟล์ CSS แยกสำหรับ OTPLogin

function OTPLogin() {
  const navigate = useNavigate();
  const [hnNumber, setHnNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = () => {
    if (hnNumber) {
      const role = "parent"; // ✅ หรือกำหนดเป็น role ที่เหมาะสม
      alert("OTP sent: 123456 (ใช้สำหรับการทดสอบ)");

      // ✅ เก็บลง localStorage
      localStorage.setItem("hnNumber", hnNumber);
      localStorage.setItem("role", role);

      // ✅ ส่ง hnNumber + role ไปหน้า enter-otp
      navigate("/enter-otp", { state: { hnNumber, role } });
    } else {
      alert("Please enter your HN Number.");
    }
  };

  return (
    <div className="otp-login-container">
      <h1>Login to your Account</h1>
      <p>Enter your HN Number to receive an OTP:</p>
      <input
        type="text"
        placeholder="HN Number"
        value={hnNumber}
        onChange={(e) => setHnNumber(e.target.value)}
        className="input-field"
      />
      <button className="primary-button" onClick={handleSendOTP}>
        Send OTP
      </button>
    </div>
  );
}

export default OTPLogin;
