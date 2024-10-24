"use client";
import { Role, isAuthenticatedAndUserData } from '@/lib/auth';
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: number;
    username: string;
    email: string;
    password_hash: null;
    created_at: string;
    last_login: null;
    updated_at: Date;
    iat: Date;
    exp: Date;
    role: Role;
}

interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component to wrap around the app
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    const auth = await isAuthenticatedAndUserData();
    if(auth.user){
        setUser(auth.user);
    }
    
  };

  const logout = () => {
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
