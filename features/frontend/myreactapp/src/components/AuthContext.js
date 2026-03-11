import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("auth_user")); } 
    catch { return null; }
  });

  const login  = (u) => { setUser(u); sessionStorage.setItem("auth_user", JSON.stringify(u)); };
  const logout = ()  => { setUser(null); sessionStorage.removeItem("auth_user"); };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }