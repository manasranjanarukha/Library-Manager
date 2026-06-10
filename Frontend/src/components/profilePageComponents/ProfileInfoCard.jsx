// React
import React from "react";
// Icons
import {
  Mail,
  Calendar,
  UserIcon,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
// ─── Text input ────────────────────────────────────────────────────────────────
function TextInput({ value, onChange, type = "text", error, placeholder }) {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#1E293B] placeholder-[#94A3B8]",
          "outline-none transition-all duration-200",
          "focus:ring-2 focus:ring-[#0F766E]/25 focus:border-[#0F766E]",
          error ? "border-[#DC2626]/60" : "border-slate-200",
        ].join(" ")}
      />
      {error && (
        <p className="flex items-center gap-1 text-[#DC2626] text-xs mt-1.5 font-medium">
          <AlertCircle className="w-3 h-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
function ReadValue({ children, mono = false }) {
  return (
    <div
      className={`px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm text-[#1E293B] ${
        mono ? "font-mono tabular-nums" : ""
      }`}
    >
      {children}
    </div>
  );
}

// ─── Field label + content ─────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-[#64748B] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Info Card ─────────────────────────────────────────────────────────────────
function InfoCard({
  icon: Icon,
  iconColor = "text-[#0F766E]",
  iconBg = "bg-[#0F766E]/8",
  title,
  children,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:border-[#0F766E]/20 hover:shadow-[0_6px_24px_rgba(15,118,110,0.08)] transition-all duration-200">
      <h2 className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-[#1E293B] mb-5">
        <span
          className={`inline-flex w-8 h-8 rounded-lg items-center justify-center flex-shrink-0 ${iconBg}`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} aria-hidden="true" />
        </span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
export default function ProfileInfoCard({
  isEditing,
  userData,
  tempData,
  setTempData,
  errors,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 animate-[fadeUp_0.4s_ease_both]">
      {/* Contact */}
      <InfoCard icon={Mail} title="Contact Information">
        <Field label="Full Name">
          {isEditing ? (
            <TextInput
              value={tempData.fullName}
              onChange={(v) => setTempData((p) => ({ ...p, fullName: v }))}
              error={errors.fullName}
              placeholder="Your full name"
            />
          ) : (
            <ReadValue>{userData.fullName}</ReadValue>
          )}
        </Field>
        <Field label="Email Address">
          {isEditing ? (
            <TextInput
              type="email"
              value={tempData.email}
              onChange={(v) => setTempData((p) => ({ ...p, email: v }))}
              error={errors.email}
              placeholder="your@email.com"
            />
          ) : (
            <ReadValue>
              <span className="break-all">{userData.email}</span>
            </ReadValue>
          )}
        </Field>
      </InfoCard>

      {/* Account */}
      <InfoCard
        icon={Calendar}
        iconColor="text-[#0891B2]"
        iconBg="bg-[#0891B2]/8"
        title="Account Details"
      >
        <Field label="Role">
          <ReadValue>
            <span className="inline-flex items-center gap-2">
              <UserIcon
                className="w-3.5 h-3.5 text-[#0F766E]"
                aria-hidden="true"
              />
              {userData.userType}
            </span>
          </ReadValue>
        </Field>
        <Field label="Member Since">
          <ReadValue mono>{formatDate(userData.createdAt)}</ReadValue>
        </Field>
        <Field label="Terms & Conditions">
          <div
            className={[
              "flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium",
              userData.termsAccepted
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-[#DC2626]/20 bg-[#DC2626]/5 text-[#DC2626]",
            ].join(" ")}
          >
            {userData.termsAccepted ? (
              <>
                <CheckCircle
                  className="w-4 h-4 flex-shrink-0"
                  aria-hidden="true"
                />
                Accepted
              </>
            ) : (
              <>
                <X className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                Not Accepted
              </>
            )}
          </div>
        </Field>
      </InfoCard>
    </div>
  );
}
