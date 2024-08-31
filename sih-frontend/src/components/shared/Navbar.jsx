import { useSpreadsheet } from '@/context/SpreadsheetContext';
import { getCurrentUser, logoutUser } from '@/lib/api/auth'
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
const navigate = useNavigate();
const [user, setUser] = useState(null);
useEffect(() => {
  const fetchUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };
  fetchUser();
},[]);

const Logout = async () => {
    
    try {
        const response = await logoutUser();
        console.log("User logged Out: ", response.data);
        navigate("/sign-up");
    } catch (error) {
        console.error("Logout error: ", error.response?.data || error.message);
    }
}
  return (
    <>
      {user ? (
        <button
          onClick={Logout}
          className="border-[1px] py-2 px-4 border-black text-black transition-colors ease-in duration-150 bg-white hover:bg-slate-900 hover:border-0 hover:text-white"
        >
          Log out
        </button>
      ) : null}
      <div>
      
      </div>
    </>
  )
}

export default Navbar
