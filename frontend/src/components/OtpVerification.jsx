import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Logo from '../assets/images/pig_logo.png';
import toast, { Toaster } from "react-hot-toast";
const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {

    const verifyOtp = async () => {
      const otpValue = otp.join('');
      const userID = localStorage.getItem("userID")
      const data = {
        otp: otpValue,
        userID
      }

      // console.log(data);
      try {
        const response = await axios.post('https://code-craft-pro.onrender.com/api/user/otp-verification', data);

        // console.log(response.data);

        if(response.data.status === "Success") {
            localStorage.setItem("isVerified","true")
            window.location.replace("/login")
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (otp.every(digit => digit !== '')) {
      verifyOtp(); 
    }
  }, [otp]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!isNaN(value) && value !== '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5 && value !== '') {
        refs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if ((e.keyCode === 8 || e.keyCode === 46) && index > 0 && otp[index] === '') {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      refs[index - 1].current.focus();
    }
  };

  const handlePaste = (e, index) => {
    const pasteData = e.clipboardData.getData('Text');
    if (pasteData.length === 1 && !isNaN(pasteData)) {
      const newOtp = [...otp];
      newOtp[index] = pasteData;
      setOtp(newOtp);
      if (index < 5) {
        setTimeout(() => refs[index + 1].current.focus(), 10);
      }
      e.preventDefault();
    }
  };

  useEffect(() => {

    const isVerified = localStorage.getItem("isVerified")

    if(isVerified==="true") {
      toast.success("OTP Verified")
      const timeout = (()=>{
          window.location.replace("/login");
      })
      setTimeout(timeout, 1200)
    }

  });
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#020817]">
      <Toaster/>
        <div className="mb-12">
      <div className="flex w-14 items-center justify-center mb-2 h-14 rounded-full">
          <img src={Logo} alt="logo" className='ml-10' />
          <h1 className="text-[35px] ml-3 font-bold text-white">CodeCraftPro.</h1>
        </div>
          <h3 className="text-sm text-gray-400 font-medium">OTP Verification</h3>
          </div>
      <div className="flex">
        {otp.map((digit, index) => (
          <input
            key={index}
            className="w-12 h-12 mx-1 rounded border border-gray-400 text-center text-xl focus:outline-none bg-white text-black"
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)}
            ref={refs[index]}
          />
        ))}
      </div>
      <p className="text-white mt-4">Please enter the OTP sent to your email.</p>
    </div>
  );
};

export default OtpVerification;
