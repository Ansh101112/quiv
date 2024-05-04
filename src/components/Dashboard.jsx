import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import { FiUpload } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "Users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
            setQrValue("https://quivlogin.vercel.app/");
          } else {
            alert("User data not found");
            auth.signOut();
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          alert(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      const confirmation = confirm("Are you sure want to logout?");
      if (confirmation) {
        await auth.signOut();
        alert("User logged out successfully.");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const confirmation = confirm(
        "Are you sure want to delete the account permanently?"
      );
      if (confirmation) {
        await deleteDoc(doc(db, "Users", auth.currentUser.uid));
        await auth.currentUser.delete();
        alert("User account deleted successfully.");
        navigate("/");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!userDetails) {
      const timeoutId = setTimeout(() => {
        navigate("/");
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [userDetails]);

  return (
    <div className="h-screen bg-gray-200 dark:bg-gray-800 flex flex-wrap items-center justify-center">
      <div className="container lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3 bg-white shadow-lg transform duration-200 easy-in-out">
        <div className="h-32 overflow-hidden">
          {userDetails && userDetails.coverPhoto && (
            <img
              className="w-full"
              src={userDetails.coverPhoto}
              alt="Cover Photo"
            />
          )}
        </div>
        <div className="flex justify-center px-5 -mt-12">
          {userDetails && userDetails.profilePhoto ? (
            <img
              className="h-32 w-32 bg-white p-2 rounded-full"
              src={userDetails.profilePhoto}
              alt="Profile Photo"
            />
          ) : (
            <FaUser className="h-32 w-32 bg-white p-2 rounded-full" />
          )}
        </div>
        <div>
          <div className="text-center px-14">
            <h2 className="text-gray-800 text-3xl font-bold">
              {userDetails ? userDetails.name : "Loading..."}
            </h2>
            <a
              className="text-gray-400 mt-2 hover:text-blue-500"
              href={
                userDetails
                  ? `https://www.instagram.com/${userDetails.name}/`
                  : ""
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              @{userDetails ? userDetails.name : "Loading..."}
            </a>{" "}
            <span className="font-light text-sm text-pretty">
              ({userDetails ? userDetails.gender : "Loading..."})
            </span>
            <p className="mt-2 text-gray-500 text-sm">
              {userDetails ? userDetails.additionalDetails : "Loading..."}
            </p>
          </div>
          <hr
            className="w-48 h-1 mx-auto my-1 bg-gray-100 border-0 rounded md:my-3
          dark:bg-gray-700"
          />
          <p className="text-sm font-semibold text-blue-600/100 dark:text-blue-500/100">
            <span className="text-green-500 m-2"> Your email: </span>
            {userDetails ? userDetails.email : "Loading..."}
          </p>
          <p className="text-sm font-semibold text-blue-600/100 dark:text-blue-500/100">
            <span className="text-green-500 m-2"> Your Phone Number: </span>
            {userDetails ? userDetails.phone : "Loading..."}
          </p>
          <p className="text-sm font-semibold text-blue-600/100 dark:text-blue-500/100">
            <span className="text-green-500 m-2"> You are from: </span>
            {userDetails ? userDetails.country : "Loading..."}
          </p>
          <hr className="mt-6" />
          <span className="text-zinc-600 inline-block m-2 px-1">
            Your profile unique QR
          </span>
          <div className="m-2 flex justify-center ">
            <QRCode value={qrValue} size={80} />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
