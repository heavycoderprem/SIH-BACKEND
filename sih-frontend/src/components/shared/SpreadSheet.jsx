import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState } from "react";
import { useEffect } from "react";
import * as formulajs from '@formulajs/formulajs' 

const SpreadSheet = () => {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const handleResize = () => {
        document.getElementById('grid-container').style.height = `${window.innerHeight - 100}px`; // Adjust for any header or margin
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial setup

    return () => window.removeEventListener('resize', handleResize);
}, []);

  const createNewSheet = () => {
    const columns = ["A", "B", "C", "D", "E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    const rows = Array.from({ length: 15 }, () => ({}));
    

    setColumnDefs(
        [
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
            if (typeof value === 'string' && value.startsWith('=')) {
              try {
                // Remove the "=" sign and split the formula into its components
                const formula = value.slice(1).toUpperCase().trim();
                const [functionName, ...args] = formula.split(/\s*\(\s*/);
                
                const functionBody = formula.slice(formula.indexOf('(') + 1, formula.lastIndexOf(')'));
                const parsedArgs = functionBody.split(',').map(arg => {
                  const cellValue = params.api.getValue(arg.trim());
                  return isNaN(cellValue) ? 0 : parseFloat(cellValue);
                });

                // Find the function in formulajs and call it
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
          }
        })),
      ]
    );

    setRowData(rows);
  };

  const addRow = () => {
    setRowData([...rowData, {}]);
  };

  const addColumn = () => {
    const newColumn = { headerName: `New Column ${columnDefs.length + 1}`, field: `col${columnDefs.length + 1}`, editable: true };
        setColumnDefs([...columnDefs, newColumn]);
  };
  const rowSelection = "multiple";
  return (
    <div>
    <div>
    <button onClick={createNewSheet}>Create New Sheet</button>
    <button onClick={addRow}>Add Row</button>
    <button onClick={addColumn}>Add Column</button>
    </div>
      <div id="grid-container"
        className="ag-theme-quartz w-full"
        style={{ width: 3500, height: "calc(100vh - 100px)", marginTop: 20 }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection={rowSelection}
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
