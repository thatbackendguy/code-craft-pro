import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Logo from "../assets/images/pig_logo.png";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { FiHome } from "react-icons/fi";

export default function Navbar() {
  const [currentPathname, setCurrentPathname] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const userName = localStorage.getItem("userName");
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const logout = () => {
    localStorage.clear();
    window.location.replace("/login")
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPathname(window.location.pathname);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown();
    }
  };

  return (
    <div className="mt-[80px] text-white">
      <nav className="fixed w-full z-50 top-0 border-gray-200 bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link className="flex w-14 items-center h-14 rounded-full" to="/dashboard">
            <img src={Logo} alt="logo" className="w-10 h-10" />
            <h1 className="text-2xl ml-5 font-bold">CodeCraftPro.</h1>
          </Link>
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={`w-full md:block md:w-auto ${
              isMenuOpen ? "block" : "hidden"
            }`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700 items-center">
              <li>
                <Link
                  to="/dashboard"
                  className={`block py-2 px-3 lg:w-full w-[24%] mt-2 lg:mt-0 sm:w-[13.5%] md:w-[10%]  `}
                >
                  <FiHome className="text-xl" />
                </Link>
              </li>
              <li>
                <div className="relative" ref={dropdownRef}>
                  <span onClick={toggleDropdown}>
                    <Avatar
                      className="profile-avatar cursor-pointer"
                      name={userName}
                      size="35"
                      round={true}
                    />
                  </span>
                  {showDropdown && (
                    <ul className="absolute top-10 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg w-32">
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          onClick={closeDropdown}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 focus:outline-none"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <br></br>
    </div>
  );
}
