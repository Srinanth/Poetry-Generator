import { createContext, ReactNode, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { loginUser, signupUser} from "../helpers/api-linker";

type User = {
  name?: string;
  email: string;
  password: string;
};

type UserAuth = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch authentication status on mount
  useEffect(() => {
    async function fetchAuthStatus() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await axios.get(`https://poetry-ai-theta.vercel.app//user/auth-status`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (data && data.email) {
            setUser({ email: data.email, password: "" }); // Password is not needed here
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch auth status:", error);
        // Clear token if auth status check fails
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data) {
        setUser({ email: data.email, password: data.password });
        setIsLoggedIn(true);
        localStorage.setItem("token", data.token);
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await signupUser(name, email, password);
      setUser({ name: data.name, email: data.email, password: data.password });
      localStorage.setItem("token", data.token);
      toast.success("Signup successful");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      setUser(null);
      setIsLoggedIn(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value: UserAuth = {
    isLoggedIn,
    user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//  hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};