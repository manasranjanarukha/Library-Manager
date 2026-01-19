import React, { useEffect, useState } from "react";
import {
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { updateUserInServer } from "../service/userService";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
const API_URL = import.meta.env.VITE_API_URL;
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const userId = user?.id;
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    userType: "",
    profilePicture: "",
    termsAccepted: "",
    createdAt: "",
  });
  useEffect(() => {
    if (user) {
      setUserData({
        fullName: user?.fullName,
        email: user?.email,
        userType: user?.userType,
        profilePicture: user?.profilePicture,
        termsAccepted: user?.termsAccepted,
        createdAt: user?.createdAt,
      });
    }
    console.log("User data loaded:", userData);
  }, [user]);

  const [tempData, setTempData] = useState({ ...userData });

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...userData });
  };

  const handleSave = async () => {
    setIsEditing(false);

    try {
      const {
        result: { user: updatedUser },
      } = await updateUserInServer(userId, tempData);

      // Update local state
      setUserData(updatedUser);

      // Update global context (IMPORTANT)
      setUser(updatedUser);

      console.log("✅ User updated successfully", updatedUser);
    } catch (err) {
      console.error("❌ ERROR updating user:", err);
    }
  };

  const handleCancel = () => {
    setTempData({ ...userData });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20">
              <div className="relative">
                <img
                  src={
                    userData.profilePicture
                      ? `${API_URL}/uploads/users/profilePictures/${userData.profilePicture}`
                      : undefined
                  }
                  alt={userData.fullName}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userData.fullName
                    )}&size=200&background=4F46E5&color=fff`;
                  }}
                />
                {userData.termsAccepted && (
                  <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1.5 border-2 border-white">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-xl font-bold text-gray-900">
                  {userData.fullName}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <Shield className="w-4 h-4" />
                  {userData.userType}
                </p>
              </div>

              <button
                onClick={isEditing ? handleCancel : handleEdit}
                className="mt-4 sm:mt-0 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              Contact Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData.fullName}
                    onChange={(e) =>
                      setTempData({ ...tempData, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {userData.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={tempData.email}
                    onChange={(e) =>
                      setTempData({ ...tempData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg break-all">
                    {userData.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Account Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Type
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {userData.userType}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {formatDate(userData.createdAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terms & Conditions
                </label>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  {userData.termsAccepted ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-700 font-medium">
                        Accepted
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-500" />
                      <span className="text-red-700 font-medium">
                        Not Accepted
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
