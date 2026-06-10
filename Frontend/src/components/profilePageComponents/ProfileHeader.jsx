// React
import React from "react";
// Router
import { Link } from "react-router-dom";
// Icons
import {
  Edit2,
  Trash2,
  BookMarked,
  X,
  Shield,
  Mail,
  CheckCircle,
  Camera,
} from "lucide-react";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
const Avatar = React.memo(function Avatar({ src, name, editable }) {
  return (
    <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
      {src ? (
        <img
          src={src}
          alt={`${name}'s profile photo`}
          className="w-full h-full rounded-full object-cover ring-4 ring-white shadow-[0_4px_20px_rgba(15,118,110,0.2)]"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0F766E] to-[#14B8A6] flex items-center justify-center ring-4 ring-white shadow-[0_4px_20px_rgba(15,118,110,0.25)]">
          <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {getInitials(name)}
          </span>
        </div>
      )}
      {editable && (
        <button
          aria-label="Change profile photo"
          className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0F766E] hover:bg-[#0d6560] text-white flex items-center justify-center shadow-md transition-all duration-200 active:scale-90 border-2 border-white cursor-pointer"
        >
          <Camera className="w-3 h-3" aria-hidden="true" />
        </button>
      )}
    </div>
  );
});
export default function ProfileHeader({
  userData,
  handleEdit,
  handleCancel,
  isEditing,
  setShowDelete,
  isDeleting,
}) {
  return (
    <section
      className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(15,118,110,0.08)] overflow-hidden
    animate-[fadeUp_0.4s_ease_both]"
    >
      {/* Teal banner */}
      <div className="relative h-28 sm:h-36 overflow-hidden bg-[#0F766E]">
        {/* Decorative circles */}
        <div
          className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="absolute top-3 right-20 w-14 h-14 rounded-full bg-white/8"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-4 left-1/3 w-20 h-20 rounded-full bg-white/8"
          aria-hidden="true"
        />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true" />
        {/* Fade to white at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* ── Profile content ── */}
      <div className="px-5 sm:px-8 pb-6">
        {/*
                KEY FIX:
                - Avatar is pulled up into the banner with negative margin-top
                - Name + badges are in a SEPARATE row below, not beside the avatar
                - This guarantees the name is never hidden/clipped by the avatar
              */}

        {/* Row 1: Avatar (pulled up) + action buttons on the right */}
        <div className="flex items-end justify-between gap-3 -mt-10 sm:-mt-12 mb-4">
          {/* Avatar — floats over the banner bottom edge */}
          <Avatar
            src={userData.profilePicture}
            name={userData.fullName}
            editable={isEditing}
          />

          {/* Action buttons — aligned to the right, sit naturally in white area */}
          <div className="flex items-center gap-2 pb-1 flex-shrink-0 flex-wrap justify-end">
            <Link
              to="/saved"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 text-[#64748B] text-xs font-semibold hover:border-[#0F766E]/30 hover:text-[#0F766E] transition-all duration-200 whitespace-nowrap"
              aria-label="My reading list"
            >
              <BookMarked className="w-3.5 h-3.5" aria-hidden="true" />
              My List
            </Link>

            <button
              onClick={isEditing ? handleCancel : handleEdit}
              className={[
                "inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer",
                isEditing
                  ? "border border-slate-200 text-[#64748B] hover:bg-slate-50"
                  : "bg-[#0F766E] hover:bg-[#0d6560] text-white shadow-sm hover:shadow-md",
              ].join(" ")}
              aria-label={isEditing ? "Cancel editing" : "Edit profile"}
            >
              {isEditing ? (
                <>
                  <X className="w-3.5 h-3.5" aria-hidden="true" /> Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5" aria-hidden="true" /> Edit
                </>
              )}
            </button>

            <button
              onClick={() => setShowDelete(true)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border border-[#DC2626]/20 bg-[#DC2626]/5 text-[#DC2626] text-xs font-semibold hover:bg-[#DC2626] hover:text-white transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer  "
              aria-label="Delete account"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isDeleting ? "Deleting..." : "Delete"}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Full name — its own full-width row, ALWAYS fully visible */}
        <div className="mb-3">
          <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] leading-tight tracking-tight">
            {userData.fullName}
          </h1>
        </div>

        {/* Row 3: Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F766E]/8 text-[#0F766E] text-[10px] font-bold uppercase tracking-widest border border-[#0F766E]/15">
            <Shield className="w-3 h-3" aria-hidden="true" />
            {userData.userType}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[#64748B] text-[10px] font-medium border border-slate-200">
            <Mail className="w-3 h-3" aria-hidden="true" />
            <span className="truncate max-w-[180px] sm:max-w-none">
              {userData.email}
            </span>
          </span>
          {userData.termsAccepted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
              <CheckCircle className="w-3 h-3" aria-hidden="true" />
              Verified
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
