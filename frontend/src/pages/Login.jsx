import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Logo from "../assets/images/pig_logo.png";

export default function LoginPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BACKEND_URL+"/api/user/login",
        user
      );

      // console.log(response);
      if (response.data.status === "success") {
        localStorage.setItem("token", response.data?.token);
        localStorage.setItem("userID", response.data?._id);
        localStorage.setItem("userName", response.data?.name);

        console.log("Login success", response.data);
        toast.success("Login success");

      } else if (response.data.status === "error") {
        console.log("error: ", response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Login Failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  // TO LOGIN AUTOMATICALLY IF TOKEN IS PRESENT
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isVerified = localStorage.getItem("isVerified");

    if (isVerified === "false") {
      window.location.replace("/otp-verification");
    }

    if (token) {
      window.location.replace("/dashboard");
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-[#020817]">
      <Toaster />
      <div className="min-w-[400px]">
        <div className="flex w-14 items-center h-14 rounded-full">
          <img src={Logo} alt="logo" />
          <h1 className="text-[40px] ml-4 font-bold text-white">
            CodeCraftPro.
          </h1>
        </div>
        <br />
        <h3 className="text-sm text-gray-400 font-medium">
          Enhance productivity with collaboration.
        </h3>
        <br></br>
        <form className="max-w-sm">
          <div className="mb-5">
            <input
              type="email"
              id="email"
              className="border border-gray-700 text-gray-300 text-sm rounded-lg w-full p-2.5 bg-[#020817]"
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
          <button
            type="button"
            onClick={onLogin}
            className="text-[14px] rounded-lg py-2 w-full bg-white text-black"
            disabled={buttonDisabled}
          >
            Login
          </button>
          <br></br>
          <br></br>
          <h1 className="text-white">
            Don&apos;t have an account ?{" "}
            <a href="/signup" className="underline">
              Signup
            </a>
          </h1>
        </form>
      </div>
    </div>
  );
}
