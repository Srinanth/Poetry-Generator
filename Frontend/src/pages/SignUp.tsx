import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation checks
    if (!termsAccepted) {
      toast.error("You must accept the terms and conditions to sign up.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      toast.loading("Signing Up", { id: "signup" });
      await auth?.signup(name, email, password);
      toast.success("Signed Up Successfully", { id: "signup" });
      navigate("/chat");
    } catch (error) {
      toast.error("Signing Up Failed", { id: "signup" });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-charizardBlack text-charizardText">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
        <form onSubmit={submitHandler}>
          {/* Sign Up Heading */}
          <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm text-charizardText mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-charizardBlue"
            />
          </div>

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

          {/* Password Input with Toggle */}
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

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label className="block text-sm text-charizardText mb-1">Confirm Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-charizardBlue"
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              className="mr-2 w-4 h-4 text-charizardBlue focus:ring-charizardBlue cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-charizardText cursor-pointer">
              I've read the <span className="text-charizardBlue underline">terms and conditions</span>
            </label>
          </div>

          {/* Create New User Button */}
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-medium transition ${
              termsAccepted
                ? "bg-charizardBlue text-black hover:bg-charizardHover cursor-pointer"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!termsAccepted}
          >
            Create New User
          </button>

          {/* Divider */}
          <div className="my-4 border-b border-gray-600 text-center">
            <span className="bg-gray-900 px-2 text-charizardText">or</span>
          </div>
            
          {/* Sign Up with Google Button a fn for later */}
          <button className="w-full flex items-center justify-center gap-2 bg-charizardBlue text-white py-2 rounded-lg font-medium hover:bg-charizardHover transition">
            <FaGoogle />
            Sign Up with Google
          </button>

          {/* Already a User? Login Link */}
          <p className="text-center text-sm text-charizardText mt-4">
            Already a user?{" "}
            <a href="/login" className="text-charizardOrange hover:underline">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;