import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';

interface User {
  name: string;
  email: string;
  userType: 'doctor' | 'patient';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, navigate] = useLocation();

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('telemedicine_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function - in a real app, this would make an API call
  const login = async (username: string, password: string) => {
    // Simulate API call
    // For demo purposes, we'll just accept any credentials
    const mockUser: User = {
      name: 'Dr. Sophie Martin',
      email: 'sophie.martin@telemed.com',
      userType: 'doctor',
    };
    
    // Store user in localStorage
    localStorage.setItem('telemedicine_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('telemedicine_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}