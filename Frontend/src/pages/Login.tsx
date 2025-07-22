import React, {useState} from "react";
import { FaGoogle } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import {useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.loading("Logging in", {id:'login'});
      await auth?.login(email,password);

      toast.success("Logged in successfully", {id:'login'});
      navigate("/chat"); 
    } catch (error) {
      toast.error("Failed to login", {id:'login'});
    }
  
  
  };
  const [passwordVisible, setPasswordVisible] = useState(false);
  

  return (
    <div className="flex justify-center items-center h-screen bg-charizardBlack text-charizardText">
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
    <form onSubmit={submitHandler}>
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

      {/* Continue with Google */}
      <button className="w-full flex items-center justify-center gap-2 bg-charizardBlue text-white py-2 rounded-lg font-medium hover:bg-charizardHover transition">
        <FaGoogle />
        Continue with Google
      </button>

      <div className="my-4 border-b border-gray-600"></div>

      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-sm text-charizardText mb-1">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-charizardBlue"
        />
      </div>

      {/* Password Input with Show/Hide Toggle */}
      <div className="mb-4 relative">
        <label className="block text-sm text-charizardText mb-1">Password</label>
        <input
          type={passwordVisible ? "text" : "password"}
          id="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}   
          placeholder="Enter your password"
          className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-charizardBlue"
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-sm text-charizardText"
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? "Hide" : "Show"}
        </button>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex justify-between items-center text-sm mb-4">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          Remember me
        </label>
        <a href="#" className="text-charizardOrange hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Login Button */}
      <button className="w-full bg-charizardBlue text-black py-2 rounded-lg font-medium hover:bg-charizardHover transition"
      type="submit"
      >
        Login
      </button>

      {/* Signup Link */}
      <p className="text-center text-sm text-charizardText mt-4">
        Not a user?{" "}
        <a href="/SignUp" className="text-charizardOrange hover:underline">
          Sign up here
        </a>
      </p>
      </form>
    </div>
  </div>
  );
};

export default Login;
