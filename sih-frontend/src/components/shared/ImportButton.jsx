import { getCurrentUser } from '@/lib/api/auth';
import axiosInstance from '@/lib/api/axios';
import React, { useState } from 'react';


import React from 'react'
import { useNavigate } from 'react-router-dom';

const ImportButton = async () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const user = await getCurrentUser();
    const userId = user.data._id;
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const handleImport = async () => {
      if (!file) return alert("Please select a file to upload");
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('owner', userId);
  
      try {
        const response = await axiosInstance.post('/api/v1/sheets/import-sheet', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("Sheet imported successfully:", response.data);
        navigate(`/sheet/${response._id}`);
      } catch (error) {
        console.error("Error importing sheet:", error.response ? error.response.data : error.message);
      }
    };
  
    return (
      <div>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button onClick={handleImport}>Import Excel Sheet</button>
      </div>
    );
}

export default ImportButton
