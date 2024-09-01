import { useSpreadsheet } from "@/context/SpreadsheetContext";
import React from "react";
import ShareSheet from "./ShareSheet";



const TableFunctionalities = ({sheetId}) => {
 

  const { addRow, addColumn, deleteRow, deleteColumn } = useSpreadsheet();
  return (
    <div className="w-screen flex justify-center py-4 gap-2 items-center">
      
      <button
        onClick={addRow}
        className="border-[1px] py-2 px-4 border-black text-black transition-colors ease-in duration-150 bg-white hover:bg-slate-900 hover:border-0 hover:text-white"
      >
        Add Row
      </button>
      <button
        onClick={deleteRow}
        className="border-[1px] py-2 px-4 border-black text-black transition-colors ease-in duration-150 bg-white hover:bg-slate-900 hover:border-0 hover:text-white"
      >
        Delete Row
      </button>
      <button
        onClick={addColumn}
        className="border-[1px] py-2 px-4 border-black text-black transition-colors ease-in duration-150 bg-white hover:bg-slate-900 hover:border-0 hover:text-white"
      >
        Add Column
      </button>
      <button
        onClick={deleteColumn}
        className="border-[1px] py-2 px-4 border-black text-black transition-colors ease-in duration-150 bg-white hover:bg-slate-900 hover:border-0 hover:text-white"
      >
        Delete Column
      </button>
      <div className="hover:scale-[1.1] pl-3">
      <ShareSheet sheetId={sheetId}/>
      </div>
    </div>
  );
};

export default TableFunctionalities;
