
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (nickname: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call to authenticate
    // For now, we'll simulate authentication
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock validation (in real app this would be server-side)
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: email,
        nickname: email.split('@')[0],
        avatar: undefined,
        createdAt: new Date().toISOString(),
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return;
    }
    
    throw new Error("Invalid credentials");
  };

  const signup = async (nickname: string, email: string, password: string) => {
    // In a real app, this would be an API call to register
    // For now, we'll simulate registration
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock validation (in real app this would be server-side)
    if (nickname && email && password.length >= 6) {
      // In a real app, we'd create the user on the server
      // Here we'll just return success and expect them to login
      return;
    }
    
    throw new Error("Invalid registration details");
  };

  const logout = async () => {
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = async (userData: User) => {
    // In a real app, this would update the user on the server
    // For now, we'll just update local state
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
