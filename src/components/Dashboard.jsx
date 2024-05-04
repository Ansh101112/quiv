import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
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
      await auth.signOut();
      alert("User logged out successfully.");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteDoc(doc(db, "Users", auth.currentUser.uid));
      await auth.currentUser.delete();
      confirm("Are you sure want to delete the account permanently?");
      alert("User account deleted successfully.");
      navigate("/");
    } catch (error) {
      console.error("Delete account error:", error);
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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-md">
        {loading ? (
          <div className="p-4 bg-gray-200 rounded-md shadow-md">Loading...</div>
        ) : userDetails ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">
                Welcome {userDetails.name} 😀
              </h3>
              <div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600"
                >
                  Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete Account
                </button>
              </div>
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
                <p className="text-gray-600 mb-2">{userDetails.email}</p>
                <p className="text-gray-600 mb-2">{userDetails.phone}</p>
                <p className="text-gray-600 mb-2">{userDetails.country}</p>
                <p className="text-gray-600">{userDetails.additionalDetails}</p>
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
  );
};

export default Dashboard;
