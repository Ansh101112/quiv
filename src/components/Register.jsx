import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NavLink, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "male",
    country: "",
    additionalDetails: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null); // State to store profile photo file

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name, phone, gender, country, additionalDetails } =
      formData;

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const photoRef = ref(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(photoRef, profilePhoto, {
        contentType: Image,
      });
      const photoURL = await getDownloadURL(photoRef);
      // Store user details in Firestore
      await setDoc(doc(db, "Users", user.uid), {
        email,
        name,
        phone,
        gender,
        country,
        additionalDetails,
        profilePhoto: photoURL,
      });

      console.log("User registered Successfully.");
      alert("User registered successfully.");
      toast.success("User registered successfully.", {
        position: "top-center",
      });

      // Navigate to the login page after registration
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-800 flex justify-center items-center">
      <div className="max-w-md w-full p-8 bg-gray-300 rounded-md shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Register Here</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 px-3 py-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="text"
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

          {/* Phone Number */}
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 px-3 py-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Profile Photo */}
          <div className="mb-4">
            <label
              htmlFor="profile-photo"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Photo:
            </label>
            <input
              type="file"
              id="profile-photo"
              name="profilePhoto"
              accept="image/*"
              onChange={handleFileChange} // Call handleFileChange when a file is selected
              className="mt-1 px-3 py-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Gender:
            </label>
            <div className="mt-1 flex items-center">
              <label className="mr-4">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="mr-1"
                  required
                />{" "}
                Male
              </label>
              <label className="mr-4">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className="mr-1"
                  required
                />{" "}
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={handleChange}
                  className="mr-1"
                  required
                />{" "}
                Other
              </label>
            </div>
          </div>

          {/* Country */}
          <div className="mb-4">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country:
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1 px-3 py-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
              required
            >
              <option value="" disabled>
                Select Country
              </option>
              <option value="USA">United States</option>
              <option value="India">India</option>
              <option value="UK">United Kingdom</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          {/* Additional Personal Details */}
          <div className="mb-4">
            <label
              htmlFor="additional-details"
              className="block text-sm font-medium text-gray-700"
            >
              Add your bio:
            </label>
            <textarea
              id="additional-details"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
              rows="2"
              className="mt-1 px-3 py-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            Sign Up
          </button>
          <NavLink to="/" className="text-gray-700 block text-center">
            <span className="block">Already a user?</span> Login here
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default Register;
