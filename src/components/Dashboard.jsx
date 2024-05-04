import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";

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
            setQrValue(window.location.origin + "/dashboard/"); // Set UID as QR code value
          } else {
            alert("User data not found");
            auth.signOut();
            navigate("/");
            console.log("User data not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
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
      await auth.signOut();
      alert("User logged out successfully.");
      console.log("User logged out successfully.");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
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
    <>
      <div className="min-h-screen bg-blue-800 flex justify-center items-center">
        <div className="max-w-xl w-full p-6 bg-gray-300 rounded-md shadow-md">
          {loading ? (
            <div className="p-4 bg-white rounded-md shadow-md">Loading...</div>
          ) : userDetails ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">
                  Welcome {userDetails.name} 😀
                </h3>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
              <div className="flex items-center mb-6">
                {userDetails.profilePhoto && (
                  <img
                    src={userDetails.profilePhoto}
                    alt="Profile Photo"
                    className="w-20 h-20 rounded-full mr-4"
                  />
                )}
                <div>
                  <p className="text-lg font-semibold">{userDetails.name}</p>
                  <p className="text-gray-600">{userDetails.email}</p>
                  <p className="text-gray-600">{userDetails.phone}</p>
                  <p className="text-gray-600">{userDetails.country}</p>
                  <p className="text-gray-600">
                    {userDetails.additionalDetails}
                  </p>
                </div>
              </div>
              <div className="mb-6">
                <QRCode value={qrValue} size={150} />
              </div>
            </>
          ) : (
            <p>No user details found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
