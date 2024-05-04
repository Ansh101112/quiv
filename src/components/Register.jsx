import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";

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
  const [coverPhoto, setCoverPhoto] = useState(null); // State to store cover photo file
  const [loading, setLoading] = useState(false); // State to track loading status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, photoType) => {
    const file = e.target.files[0];
    if (photoType === "profile") {
      setProfilePhoto(file);
    } else if (photoType === "cover") {
      setCoverPhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name, phone, gender, country, additionalDetails } =
      formData;

    try {
      setLoading(true); // Start loading

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Upload profile photo
      const profilePhotoRef = ref(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(profilePhotoRef, profilePhoto, {
        contentType: "image/jpeg",
      });
      const profilePhotoURL = await getDownloadURL(profilePhotoRef);

      // Upload cover photo
      const coverPhotoRef = ref(storage, `coverPhotos/${user.uid}`);
      await uploadBytes(coverPhotoRef, coverPhoto, {
        contentType: "image/jpeg",
      });
      const coverPhotoURL = await getDownloadURL(coverPhotoRef);

      // Store user details in Firestore
      await setDoc(doc(db, "Users", user.uid), {
        email,
        name,
        phone,
        gender,
        country,
        additionalDetails,
        profilePhoto: profilePhotoURL,
        coverPhoto: coverPhotoURL,
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
      alert(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className=" min-h-screen bg-blue-800 flex justify-center items-center">
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
          j
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
      <div className="max-w-md w-full p-5 m-6 bg-gray-300 rounded-md shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Register Here</h2>
        <form onSubmit={handleSubmit}>
          {/* Your form inputs */}
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
              <FiUpload className="inline-block mr-1" /> Upload Profile Photo:
            </label>
            <input
              type="file"
              id="profile-photo"
              name="profilePhoto"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "profile")}
              className="mt-1 px-3 py-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Cover Photo */}
          <div className="mb-4">
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium text-gray-700"
            >
              <FiUpload className="inline-block mr-1" /> Upload Cover Photo:
            </label>
            <input
              type="file"
              id="cover-photo"
              name="coverPhoto"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "cover")}
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
            disabled={loading} // Disable button when loading
          >
            {loading ? "Loading... Please wait" : "Sign Up"}{" "}
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
