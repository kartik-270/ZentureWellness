import React, { useState } from "react";
import { useLocation } from "wouter"; // ✅ use wouter instead of next/router
import { apiConfig } from "@/lib/config";

const CounsellorRegister: React.FC = () => {
  const [step, setStep] = useState(1); // To manage the registration flow
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [message, setMessage] = useState("");

  const [, setLocation] = useLocation(); // ✅ navigation handler

  // Step 1: Register the counsellor user
  const handleRegister = async () => {
    try {
      const response = await fetch(
        `${apiConfig.baseUrl}/counsellor/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "✅ User registered! Now, let's log you in to complete your profile."
        );
        await handleLogin(); // Automatically log in to get the token
      } else {
        setMessage(`❌ ${data.msg}`);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setMessage("❌ Server error during registration. Try again.");
    }
  };

  // Step 2: Log in to get the authentication token
  const handleLogin = async () => {
    try {
      const response = await fetch(
        `${apiConfig.baseUrl}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("authToken", data.access_token);
        setMessage(
          "✅ Logged in successfully! Please provide your specialization."
        );
        setStep(2); // Move to the profile creation step
      } else {
        setMessage("❌ Auto-login failed. Please log in manually.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("❌ Server error during login.");
    }
  };

  // Step 3: Create the counsellor profile
  const handleCreateProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("❌ Auth token not found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `${apiConfig.baseUrl}/counsellor/create-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ specialization }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.msg} Redirecting to dashboard...`);
        setTimeout(() => setLocation("/counsellor/dashboard"), 2000); // ✅ use wouter navigation
      } else {
        setMessage(`❌ ${data.msg}`);
      }
    } catch (error) {
      console.error("Profile Creation Error:", error);
      setMessage("❌ Server error during profile creation.");
    }
  };

  // Main form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      handleRegister();
    } else {
      handleCreateProfile();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          {step === 1 ? "Counsellor Registration" : "Complete Your Profile"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-400"
              />
            </>
          ) : (
            <input
              type="text"
              placeholder="e.g., Cognitive Behavioral Therapy"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-400"
            />
          )}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
          >
            {step === 1 ? "Register" : "Complete Profile"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default CounsellorRegister;
