import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // using usestate to get and set the user token and for validations
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // setting the user and removing the user from local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); //set user or login
    } else {
      localStorage.removeItem("user"); //remove user or logout
    }
  }, [user]);

  //Logon User

  const login = (userData) => {
    console.log("User logged in:", userData);
    setUser(userData);
  };
  //Log Out

  const logout = () => {
    console.log("User logged out");
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
