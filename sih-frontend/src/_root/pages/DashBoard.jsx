
import React from 'react'

import { useNavigate } from 'react-router-dom'

const DashBoard = () => {
  const navigate = useNavigate();
  
  const createNewSheet = () => {
    
    const newSheetId = Date.now(); 

    
    navigate(`/sheet/${newSheetId}`);
  };

  return (
    <div>
       <button onClick={createNewSheet}>Create New Sheet</button>
      
    </div>
  )
}

export default DashBoard
