import { useContext,createContext,useState } from "react";




const SpreadsheetContext = createContext();

export const SpreadsheetProvider = ({ children }) => {
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);

    const addRow = () => setRowData(prevRowData => [...prevRowData, {}]);
    const deleteRow = () => setRowData(prevRowData => prevRowData.slice(0, -1));
    const addColumn = () => setColumnDefs(prevColDefs => [...prevColDefs, { headerName: `New Column ${prevColDefs.length + 1}`, field: `col${prevColDefs.length + 1}`, editable: true }]);
    const deleteColumn = () => setColumnDefs(prevColDefs => prevColDefs.slice(0, -1));

    return (
        <SpreadsheetContext.Provider value={{ rowData, columnDefs, addRow, deleteRow, addColumn, deleteColumn, setRowData, setColumnDefs }}>
            {children}
        </SpreadsheetContext.Provider>
    );
};  

export const useSpreadsheet = () => useContext(SpreadsheetContext);