import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { useEffect } from "react";
import * as formulajs from "@formulajs/formulajs";
import { useParams } from "react-router-dom";

import { useSpreadsheet } from "@/context/SpreadsheetContext";
import { updateSheet } from "@/lib/api/sheet";

const SpreadSheet = () => {
  const { columnDefs, setColumnDefs, rowData, setRowData } = useSpreadsheet();
  const { sheetId } = useParams();
  useEffect(() => {
    const handleResize = () => {
      document.getElementById("grid-container").style.height =
        `${window.innerHeight - 100}px`; // Adjust for any header or margin
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial setup

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const onCellValueChanged = async (event) => {
    const { data, colDef, newValue } = event;
    const colIndex = columnDefs.findIndex((col) => col.field === colDef.field);
    const rowIndex = rowData.indexOf(data);

    if (rowIndex === -1 || colIndex === -1) {
      console.error("Error: Could not find the row or column to update.");
      return;
    }

    const updatedRowData = [...rowData];
    updatedRowData[rowIndex][colDef.field] = newValue;

    setRowData(updatedRowData); 

    try {
      await updateSheet(
        sheetId,
        updatedRowData,
        "updateData",
        rowIndex,
        colIndex
      );
      console.log("Sheet updated successfully:", {
        rowIndex,
        colIndex,
        newValue,
      });
    } catch (error) {
      console.error("Error updating sheet data:", error);
    }
  };

  useEffect(() => {
    const columns = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
        "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
        "W", "X", "Y", "Z"
    ];

    const generateColumnDefs = () => [
        {
            headerName: "#",
            valueGetter: "node.rowIndex + 1", // Row numbers starting from 1
            width: 50,
            pinned: "left",
        },
        ...columns.map((col) => ({
            headerName: col,
            field: col,
            editable: true,
            valueGetter: (params) => {
                const value = params.data[col];
                if (typeof value === "string" && value.startsWith("=")) {
                    try {
                        const formula = value.slice(1).toUpperCase().trim();
                        const [functionName, ...args] = formula.split(/\s*\(\s*/);
                        const functionBody = formula.slice(
                            formula.indexOf("(") + 1,
                            formula.lastIndexOf(")")
                        );
                        const parsedArgs = functionBody.split(",").map((arg) => {
                            const cellValue = params.api.getValue(arg.trim());
                            return isNaN(cellValue) ? 0 : parseFloat(cellValue);
                        });

                        const formulaFunction = formulajs[functionName];
                        if (formulaFunction) {
                            return formulaFunction(...parsedArgs);
                        }
                        return `#ERROR!`;
                    } catch (error) {
                        return `#ERROR!`;
                    }
                }
                return value;
            },
        })),
    ];

    setColumnDefs(generateColumnDefs());

}, [sheetId]);  // Only depend on sheetId

  const rowSelection = "multiple";

  return (
    <div className="relative">
      <div
        id="grid-container"
        className="ag-theme-quartz w-full"
        style={{ width: 3500, height: "calc(100vh - 100px)", marginTop: 20 }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection={rowSelection}
          onCellValueChanged={onCellValueChanged}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            editable: true,
            flex: 1,
          }}
        />
      </div>
    </div>
  );
};

export default SpreadSheet;
