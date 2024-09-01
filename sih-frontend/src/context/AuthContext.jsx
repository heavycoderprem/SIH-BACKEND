import { refreshToken } from "@/lib/api/auth";
import { useEffect } from "react";
import { useState } from "react";
import { useContext, createContext } from "react";




const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({children}) => {
    const[user,setUser] = useState(null);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                await refreshToken();
                
            } catch (error) {
                console.error("Failed to refresh Token", error);
            }
        };
        initializeUser();
    }, []);

    return (
        <AuthContext.Provider value={{user,setUser}}>
        {children}

        </AuthContext.Provider>
    );

};
export default AuthProvider;
