import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import Cookies from 'js-cookie';
export const AuthContext = React.createContext();
export default function AuthProvider({children}) {
  
    const setCookies = (userData) => {
        Cookies.set('userData', JSON.stringify(userData), { expires: 7 }); // Set expiration if needed
      };
    const getUserFromCookies = () => {
        const userCookie = Cookies.get('userData');
        return userCookie ? JSON.parse(userCookie) : null;
    };
    const clearCookies = () => {
        Cookies.remove('userData');
    };
    
    const [user, setUser] = useState(getUserFromCookies());
    const navigate = useNavigate();
    const login = (username, email, photoURL) => {
      // Perform your login logic here (e.g., API request, validation)
      // For simplicity, let's assume a successful login and set the user
      const loggedInUser = { username, email, photoURL };
      setUser(loggedInUser);
      
      // Set user data in cookies
      setCookies(loggedInUser);
    };

  
    const logout = () => {
      // Perform your logout logic here (e.g., clearing cookies, API request)
      clearCookies();
      setUser(null);
      navigate('/')
    };
  
  return (
    // <div>AuthProvider</div>
    <AuthContext.Provider value={{user, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    return useContext(AuthContext);
};