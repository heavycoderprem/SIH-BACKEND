import SpreadSheet from "@/components/shared/SpreadSheet";
import TableFunctionalities from "@/components/shared/TableFunctionalities";
import { useSheetId } from "@/hooks/useSheetId";
import { deleteSheet, getSingleSheet, updateSheetName } from "@/lib/api/sheet";

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const sheetId = useSheetId();
  const [newName, setNewName] = useState("");
  const [sheetName, setSheetName] = useState("undefined");

  console.log("ID from URL:", sheetId);
  const navigate = useNavigate();

  useEffect(()=> {
    const fetchData = async () => {
      try {
        if(sheetId) {
          const sheet = await getSingleSheet(sheetId);
          setSheetName(sheet.data.name);

        }
      } catch (error) {
        console.error("Error fetching sheet data:", error);
      }
    };
    fetchData();
  }, [sheetId]);


  const handleDeleteSheet = async () => {
    if (!sheetId) return;
    try {
      await deleteSheet(sheetId);
      alert("Sheet deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting sheet:", error);
      alert("Failed to delete sheet: " + error.message);
    }
  };

  const handleUpdateSheetName = async () => {
    if (!sheetId || !newName.trim()) return;
    try {
      await updateSheetName(sheetId, newName);
      alert("Sheet name updated successfully");
      setNewName(""); // Clear input field after update
    } catch (error) {
      console.error("Error updating sheet name:", error);
      alert("Failed to update sheet name: " + error.message);
    }
  };

  return (
    <div className="relative">
      <TableFunctionalities sheetId={sheetId} />
      {sheetId ? (
        <div>
          <div className="flex gap-2  sm:w-[100vw] w-[400px] flex-wrap sm:flex sm:justify-evenly items-center">
            <button
              onClick={handleDeleteSheet}
              className="border-[1px] py-2 mt-2 px-4 border-red-500 text-red-500 transition-colors ease-in duration-150 bg-white hover:bg-red-500 hover:text-white"
            >
              Delete Sheet
            </button>

           <div>
           <input
              type="text"
              placeholder="Change sheet's name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-2"
            />
            <button
              onClick={handleUpdateSheetName}
              className="border-[1px] py-2 mt-2 px-4 border-blue-500 text-blue-500 transition-colors ease-in duration-150 bg-white hover:bg-blue-500 hover:text-white"
            >
              Update Name
            </button>
           </div>

            <h2 className="text-center uppercase">{sheetName}</h2>
          </div>
          <SpreadSheet />
        </div>
      ) : (
        <div>
          {/* Regular Home content */}
          <h1>Welcome to the Home Page</h1>
          {/* Other home page elements */}
        </div>
      )}
    </div>
  );
};

export default Home;
