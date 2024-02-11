
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import Logo from '../assets/images/pig_logo.png';
import { Toaster } from "react-hot-toast";

export default function SignupPage() {


  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/user/signup", user);
      console.log("Signup Success", response.data);
      
      window.location.replace("/login")

      toast.success("User Created Successfully");
    } catch (error) {
      console.log("Signup Failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-[#020817]">
      <Toaster />
      <div className="min-w-[400px]">
        <div className="flex w-14 items-center h-14 rounded-full">
          <img src={Logo} alt="logo" />
          <h1 className="text-[40px] ml-4 font-bold text-white">CodeCraftPro.</h1>
        </div>
        <br />
        <h3 className="text-sm text-gray-400 font-medium">Enhance productivity with collaboration.</h3>
        <br></br>
        <form className="max-w-sm ">
          <div className="mb-5 ">
            <input
              type="text"
              id="username"
              className="border border-gray-700 text-gray-300 text-sm rounded-lg w-full p-2.5 bg-[#020817]"
              placeholder="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="email"
              id="email"
              className=" border border-gray-700 text-gray-300 text-sm rounded-lg w-full p-2.5 bg-[#020817]"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="password"
              id="password"
              className="border border-gray-700 text-gray-300 text-sm rounded-lg w-full p-2.5 bg-[#020817]"
              value={user.password}
              placeholder="Password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </div>
          <button type="button" onClick={onSignup} className="text-[14px] rounded-lg py-2 w-full bg-white text-black">Sign up</button>
          <br></br><br></br>
          <h1 className="text-white">Already have an account? <Link to="/login" className="underline">Login</Link></h1>
        </form>
      </div>
    </div>
  );
}
