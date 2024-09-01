import { useEffect } from "react";
import { useParams } from "react-router-dom";

let currentSheetId = null;

export const useSheetId = () => {
    const { sheetId } = useParams();
  
    useEffect(() => {
      currentSheetId = sheetId;
    }, [sheetId]);
  
    return sheetId;
  };
  
  export const getCurrentSheetId = () => currentSheetId;