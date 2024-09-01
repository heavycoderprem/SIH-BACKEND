import axiosInstance from "./axios";


export const createSheet = async (owner) => {
    try {
        console.log("Request payload:", { owner });
        const response = await axiosInstance.post("/api/v1/sheets/create-sheet", {owner});
        return response.data.data;

    } catch (error) {
        console.error('Error creating sheet:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error.message;
        
    }

}

export const getAllSheets = async (userId) => {
    try {
        const response = await axiosInstance.get(`/api/v1/sheets/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}

export const getSingleSheet = async (sheetId) => {
    try {
        const response = await axiosInstance.get(`/api/v1/sheets/${sheetId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateSheet = async (sheetId, data, operation, rowIndex, columnIndex) => {
    try {
        const response = await axiosInstance.put(`/api/v1/sheets/update-sheet/${sheetId}`, { data, operation, rowIndex, columnIndex });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteSheet = async (sheetId) => {
    try {
        const response = await axiosInstance.delete(`/api/v1/sheets/delete-sheet/${sheetId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const shareSheet = async (sheetId, userNames, permission) => {
    try {
        const response = await axiosInstance.put(`/api/v1/sheets/share/${sheetId}`, { userNames, permission });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateSheetName = async (sheetId,newName) => {
    try {
        const response = await axiosInstance.put(`/api/v1/sheets/update-name/${sheetId}`, {newName});
        return response.data;
    } catch (error) {
        throw new Error('Failed to update sheet name');
    }
}
