import { useSpreadsheet } from '@/context/SpreadsheetContext';
import React from 'react'

const TableFunctionalities = () => {
    const { addRow, addColumn, deleteRow, deleteColumn } = useSpreadsheet();
  return (
    <div className='top-0 overflow-auto'>
      
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
      

    </div>
  )
}

export default TableFunctionalities
