import { createContext, ReactNode, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { loginUser, signupUser } from "../helpers/api-linker";

type User = {
  name?: string;
  email: string;
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

  // Check auth status on mount
  useEffect(() => {
    async function fetchAuthStatus() {
      try {
        const { data } = await axios.get(
          "https://poetry-generator-3q8c.onrender.com/api/v1/user/auth-status",
          { withCredentials: true } // Crucial for cookies
        );

        if (data?.email) {
          setUser({ email: data.email, name: data.name });
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthStatus();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      setUser({ email: data.email, name: data.name });
      setIsLoggedIn(true);
      toast.success("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await signupUser(name, email, password);
      setUser({ email: data.email, name: data.name });
      setIsLoggedIn(true);
      toast.success("Signup successful");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://poetry-generator-3q8c.onrender.com/api/v1/user/logout",
        {},
        { withCredentials: true } // Clear cookie
      );
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
