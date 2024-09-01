import axiosInstance from "@/lib/api/axios";
import { updateSheet } from "@/lib/api/sheet";
import { useEffect } from "react";
import { useContext, createContext, useState } from "react";
import { useParams } from "react-router-dom";

const SpreadsheetContext = createContext();

export const SpreadsheetProvider = ({ children }) => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const { sheetId } = useParams();

  useEffect(() => {
    console.log("SHEETID: ", sheetId);
  }, [sheetId]);

  const fetchSheetData = async () => {
    const columns = [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
      "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
      "W", "X", "Y", "Z"
    ];

    try {
      const response = await axiosInstance.get(`/api/v1/sheets/${sheetId}`);
      const sheet = response.data;
      console.log("SHEET: ", sheet.data.data);
      if (sheet && Array.isArray(sheet.data.data)) {
        const rows = sheet.data.data.map((row) => {
          const rowData = {};
          columns.forEach((col) => {
            rowData[col] = row[col] || '';
          });
          return rowData;
        });
        setRowData(rows);
      }
    } catch (error) {
      console.error("Error fetching sheet data:", error);
    }
  };
  useEffect(() => {
    if (sheetId) {
      fetchSheetData();
    }
  }, [sheetId,setRowData]);

  const addRow = async () => {
    const newRow = {}; // Add any default values if needed
    const newRowData = [...rowData, newRow];

    setRowData(newRowData); // Update the local state
    
    try {
      await updateSheet(sheetId, newRowData, "addRow");
      console.log("Row added successfully.");
      fetchSheetData();
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };
  const deleteRow = async () => {
    const newRowData = rowData.slice(0, -1);

    setRowData(newRowData); // Update the local state

    try {
      await updateSheet(sheetId, newRowData, "deleteRow", rowData.length - 1);
      console.log("Row deleted successfully.");
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };
  const addColumn = async () => {
    const newField = `col${columnDefs.length + 1}`;
    const newColDefs = [
      ...columnDefs,
      {
        headerName: `New Column ${columnDefs.length + 1}`,
        field: newField,
        editable: true,
      },
    ];

    const updatedRowData = rowData.map((row) => ({ ...row, [newField]: "" }));

    setColumnDefs(newColDefs); // Update the local state
    setRowData(updatedRowData); // Update the local state

    try {
      await updateSheet(sheetId, updatedRowData, "addColumn");
      console.log("Column added successfully.");
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };
  const deleteColumn = async () => {
    const newColDefs = columnDefs.slice(0, -1);
    const fieldToRemove = columnDefs[columnDefs.length - 1]?.field;

    const updatedRowData = rowData.map((row) => {
      const { [fieldToRemove]: removed, ...rest } = row;
      return rest;
    });

    setColumnDefs(newColDefs); // Update the local state
    setRowData(updatedRowData); // Update the local state

    try {
      await updateSheet(
        sheetId,
        updatedRowData,
        "deleteColumn",
        undefined,
        columnDefs.length - 1
      );
      console.log("Column deleted successfully.");
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };
  return (
    <SpreadsheetContext.Provider
      value={{
        rowData,
        columnDefs,
        addRow,
        deleteRow,
        addColumn,
        deleteColumn,
        setRowData,
        setColumnDefs,
      }}
    >
      {children}
    </SpreadsheetContext.Provider>
  );
};

export const useSpreadsheet = () => useContext(SpreadsheetContext);
