import axiosInstance from "./axios";

export const registerUser = async(userData) => {
    try {
        const response = await axiosInstance.post("/api/v1/users/register", userData);
        return response.data;
    } catch (error) {
        console.error('Registration error: ', error.response.data);
        throw error;
    }
}

export const loginUser = async(userData) => {
    try {
        const response = await axiosInstance.post("/api/v1/users/login", userData);
        localStorage.setItem("accessToken", response.data.accessToken);
        return response.data;
    } catch (error) {
        console.log("Login Error: ", error.response.data);
        throw error;
    }
}

export const logoutUser = async () => {
    try {
      const response = await axiosInstance.post('/api/v1/users/logout');
      // Remove the token from storage
      localStorage.removeItem('accessToken');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error.response.data);
      throw error;
    }
  };

export const getCurrentUser = async() => {
    try {
        const response = await axiosInstance.get("/api/v1/users/current-user");
        return response.data;
    } catch (error) {
        console.error("Get current user error: ", error.response.data);
        throw error;
    }
}



export const refreshToken = async () => {
    try {
      const response = await axiosInstance.post('/api/v1/users/refresh-token',{},{withCredentials: true});
      localStorage.setItem('accessToken', response.data.accessToken);
      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error.response.data);
      throw error;
    }
  };
  