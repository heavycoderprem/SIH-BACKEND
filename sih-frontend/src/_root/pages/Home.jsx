
import Navbar from "@/components/shared/Navbar";
import SpreadSheet from "@/components/shared/SpreadSheet";
import TableFunctionalities from "@/components/shared/TableFunctionalities";

import React from "react";
import { useParams } from "react-router-dom";

const Home = () => {
  const { id } = useParams();
  
  return (
    <div className="relative">
      <TableFunctionalities/>
      {id ? (
        <div>
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
