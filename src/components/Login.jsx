import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully.");
      toast.success("Loggedin Successfully.");
      alert("Loggedin Successfully.");
      navigate("/dashboard");
    } catch (error) {
      console.log("Login error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-800 flex justify-center items-center">
      {/* Image Container */}
      <div className="flex justify-center items-center w-full md:w-auto m-4">
        <img
          src="https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg?w=740&t=st=1714815244~exp=1714815844~hmac=177a565d386401d3761bebb5e558323c7e26ce1162a2cb7779605586177dfe49"
          alt="Privacy Policy"
          className="w-72 h-auto object-cover rounded-md"
          style={{
            transition: "transform 0.5s ease",
            transformStyle: "preserve-3d",
            transform: "perspective(500px) rotateY(0deg) rotateX(0deg)",
          }}
          onMouseMove={(e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 20;
            e.target.style.transform = `perspective(500px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
          }}
          onMouseEnter={(e) => {
            e.target.style.transition = "none";
          }}
          onMouseLeave={(e) => {
            e.target.style.transition = "transform 0.5s ease";
            e.target.style.transform = `perspective(500px) rotateY(0deg) rotateX(0deg)`;
          }}
        />
      </div>
      {/* Form Container */}
      <div className="max-w-md w-full p-8 bg-gray-300 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 px-3 py-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 px-3 py-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            Login
          </button>
          <NavLink
            to="/user/register"
            className="text-gray-700 block text-center mt-2"
          >
            <span className="block">New user?</span> Register here
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default Login;
