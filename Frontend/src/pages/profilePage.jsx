import { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  Edit2,
  Save,
  X,
  Trash2,
  User as UserIcon,
  BookMarked,
  ArrowLeft,
  Camera,
  AlertCircle,
} from "lucide-react";
import { updateUserInServer, deleteUserInServer } from "../service/userService";
import { UserContext } from "../context/userContext";
import ProfileHeader from "../components/profilePageComponents/ProfileHeader";
import DeleteDialog from "../components/profilePageComponents/DeleteDialog";
import ProfileInfoCard from "../components/profilePageComponents/ProfileInfoCard";
import StickySaveBar from "../components/profilePageComponents/StickySaveBar";
import PageMeta from "../components/PageMeta";

// ─── Main Page ─────────────────────────────────────────────────────────────────
const INITIAL_USER_DATA = {
  fullName: "",
  email: "",
  userType: "",
  profilePicture: "",
  termsAccepted: false,
  createdAt: "",
};
export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(INITIAL_USER_DATA);

  const [tempData, setTempData] = useState(INITIAL_USER_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveAnim, setSaveAnim] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    fullName,
    email,
    userType,
    profilePicture,
    termsAccepted,
    createdAt,
    _id,
  } = user;

  useEffect(() => {
    if (user) {
      setUserData({
        fullName,
        email,
        userType,
        profilePicture,
        termsAccepted,
        createdAt,
      });
    } else {
      alert("No user data found. Redirecting to home.");
      navigate("/");
      setUserData(INITIAL_USER_DATA);
    }
  }, [user]);

  function handleEdit() {
    setTempData({ ...userData });
    setErrors({});
    setIsEditing(true);
  }

  function handleCancel() {
    setTempData({ ...userData });
    setErrors({});
    setIsEditing(false);
  }

  const handleSave = async () => {
    try {
      const response = await updateUserInServer(_id, tempData);

      const updatedUser = response?.result?.user;
      if (!updatedUser) {
        throw new Error("Invalid response from server");
      }
      // Update local state
      setUserData(updatedUser);

      // Update global context (IMPORTANT)

      setUser(updatedUser);
      setErrors([]);
      setIsEditing(false);
      setSaveAnim(true);
      setTimeout(() => setSaveAnim(false), 2000);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error updating profile:", err);

        const formattedErrors = {};

        err?.errors?.forEach((error) => {
          formattedErrors[error.path] = error.msg;
        });

        setErrors(formattedErrors);
      }
    }
  };

  async function deleteProfile() {
    setShowDelete(false);
    alert("Delete your profile? This action cannot be undone.");
    if (isDeleting) return;

    try {
      setIsDeleting(true);

      await deleteUserInServer(_id);

      // clear auth state
      setUser(null); // from context if available

      navigate("/auth/login");
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Delete failed:", err);
      }
      alert("Failed to delete profile. Try again.");
    } finally {
      setIsDeleting(false);
    }
  }
  const closeDeleteDialog = useCallback(() => {
    setShowDelete(false);
  }, []);
  return (
    <>
      <PageMeta
        title="My Profile - Readymate"
        description="Manage your Readymate account profile and settings."
        keywords="profile, account, settings, readymate"
      />
      {showDelete && (
        <DeleteDialog onConfirm={deleteProfile} onCancel={closeDeleteDialog} />
      )}

      <main className="min-h-screen bg-[#F8FAFC]" aria-label="Profile page">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-28 space-y-5 sm:space-y-6">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#64748B] hover:text-teal-700 font-medium transition-colors duration-200 group"
          >
            <ArrowLeft
              className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200"
              aria-hidden="true"
            />
            Back to Library
          </Link>

          {/* ── Hero card ── */}
          <ProfileHeader
            userData={userData}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            isEditing={isEditing}
            setShowDelete={setShowDelete}
            isDeleting={isDeleting}
          />

          {/* ── Info cards ── */}
          <ProfileInfoCard
            isEditing={isEditing}
            userData={userData}
            tempData={tempData}
            setTempData={setTempData}
            errors={errors}
          />
          {/* ── Sticky save bar ── */}
          <StickySaveBar
            handleSave={handleSave}
            handleCancel={handleCancel}
            saveAnim={saveAnim}
            isEditing={isEditing}
          />
        </div>
      </main>
    </>
  );
}
