import axios from "../services/axios";
import React, { useContext, useEffect, useState } from 'react';
export const AppContext = React.createContext();

export default function AppProvider({children}) {
    const [render, setRender] = useState(false);
    const handleChildRender = () => {
        setRender(!render);
    }
    const [allUser, setAllUser] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/auth/getUser')
                setAllUser(response.data)
            } catch (error) {
                console.log('Cannot get ClassList', error);
            }
        };
        fetchData();
    },[render]);
  return (
    
    <AppContext.Provider value={{allUser , handleChildRender}}>
        {children}
    </AppContext.Provider>
  )
}
export const useApp = () => {
    return useContext(AppContext);
};