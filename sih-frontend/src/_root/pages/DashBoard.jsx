import { getCurrentUser } from "@/lib/api/auth";
import { createSheet, getAllSheets } from "@/lib/api/sheet";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const [sheetId, setSheetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const user = await getCurrentUser();
        console.log("User: ", user);
        console.log(user.data);
        setName(user.data.username);

        const userId = user.data._id;
        const response = await getAllSheets(userId);

        setSheets(response.data);
      } catch (error) {
        console.error("Error fetching user data or sheets:", error);
        setError(error.message);
      }
    };
    fetchSheets();
  }, []);

  const createNewSheet = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      console.log("User: ", user);
      const userId = user.data._id;
      const response = await createSheet(userId);
      console.log("Create Sheet Response:", response);
      setSheetId(response._id);
      navigate(`/sheet/${response._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); 
    }
  };
  if (loading) return <h1>Loading...</h1>;
  if (error) return <p>Error: {error}</p>;

  const handleSheetClick = (sheetId) => {
    navigate(`/sheet/${sheetId}`);
  };

  return (
    <div className="flex flex-col items-center w-full gap-10">
      <h2 className="mt-4">Welcome Back {name} !</h2>
      <div>
      <button
        onClick={createNewSheet}
        className="hover:scale-[1.1] border-solid border-1 border-black bg-green-100 px-4 py-2"
      >
        Create New Sheet
      </button>

      </div>
      <h1>Your Sheets</h1>
      <ul>
        {sheets
          .filter((sheet) => sheet && sheet.name)
          .map((sheet) => (
            <li
              key={sheet._id}
              onClick={() => handleSheetClick(sheet._id)}
              className="sheet-item cursor-pointer p-2"
            >
              <button className="px-4 py-2 text-black bg-sky-200 w-[100%] hover:bg-green-100 hover:text-black font-medium transition-colors duration-150">{sheet.name}</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default DashBoard;
