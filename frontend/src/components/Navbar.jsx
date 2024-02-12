import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Logo from '../assets/images/pig_logo.png';


export default function Navbar() {
  const [currentPathname, setCurrentPathname] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = async () => {
    try {
      localStorage.clear()
      // Assuming the API call for logout is implemented elsewhere
      await axios.get('/api/user/logout');
      // Assuming the router is handled by React Router or other routing library
      // router.push('/login');
      toast.success('Logout Successful');
      
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPathname(window.location.pathname);
    }
  }, []);

  return (
    <div className="mt-[80px] text-white">
      <nav className="bg-white fixed w-full z-50 top-0 border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex w-14 items-center h-14 rounded-full">
            <img src={Logo} alt="logo" />
            <h1 className="text-[30px] ml-5 font-bold">CodeCraftPro.</h1>
          </div>
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
          <div className={`w-full md:block md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="/"
                  className={`block py-2 px-3 lg:w-full w-[24%] mt-2 lg:mt-0 sm:w-[13.5%] md:w-[10%] ${
                    currentPathname === '/' ? 'bg-white text-blue-700 rounded' : 'text-white-900'
                  } `}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className={`block py-2 px-3 lg:w-full w-[26%] mt-2 lg:mt-0 sm:w-[13.5%] md:w-[10%] ${
                    currentPathname === '/profile' ? 'bg-white text-blue-700 rounded' : 'text-white-900'
                  } `}
                >
                  Profile
                </a>
              </li>
              <li onClick={logout}>
                <a
                  href="/"
                  className={`block py-2 px-3 lg:w-full w-[26%] mt-2 lg:mt-0 sm:w-[13.5%] md:w-[10%] bg-[tomato] rounded`}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav><br></br>
    </div>
  );
}
