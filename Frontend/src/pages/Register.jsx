import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, BookOpen, Check, Loader2, UserPlus } from "lucide-react";
import { createUserInServer } from "../service/userService";
import PageMeta from "../components/PageMeta";
import useRegisterForm from "../hooks/useRegisterForm";
import Field from "../components/Register/Field";
import Input from "../components/Register/Input";
import AvatarUpload from "../components/Register/AvatarUpload";
import PasswordInput from "../components/Register/PasswordInput";
import UserTypeSelector from "../components/Register/UserTypeSelector";

/* ══════════════════════════════════════════════════
   Account type selector cards
══════════════════════════════════════════════════ */

export default function Register() {
  const { form, errors, loading, handleChange, handleSubmit, previewUrl } =
    useRegisterForm();

  return (
    <>
      <PageMeta
        title="Create Your Account"
        description="Join Readymate to explore books, build your reading list, share reviews, and publish your work as an author."
        keywords="register, sign up, reader, author, books, reading platform, book reviews, publish books"
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* Page background */}
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-lg fade-up">
          {/* ── Logo / brand row ── */}
          <div className="mb-6 flex items-center justify-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <span
              className="text-lg font-semibold tracking-tight text-slate-800"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Ready<span className="text-teal-700">mate</span>
            </span>
          </div>

          {/* ── Form card ── */}
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            {/* Card header */}
            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Create an account
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Join thousands of readers and authors on Readymate
              </p>
            </div>

            {/* Form body */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5 px-6 py-6 sm:px-8 sm:py-7"
            >
              {/* ── Profile photo ── */}
              <AvatarUpload
                previewUrl={previewUrl}
                error={errors.profilePicture}
                onChange={handleChange}
              />

              {/* ── Full name ── */}
              <Field label="Full name" required error={errors.fullName}>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  error={errors.fullName}
                  autoComplete="name"
                />
              </Field>

              {/* ── Email ── */}
              <Field label="Email address" required error={errors.email}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  error={errors.email}
                  autoComplete="email"
                />
              </Field>

              {/* ── Password + Confirm — side by side on sm+ ── */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Password" required error={errors.password}>
                  <PasswordInput
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    error={errors.password}
                  />
                </Field>
                <Field
                  label="Confirm password"
                  required
                  error={errors.confirmPassword}
                >
                  <PasswordInput
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    error={errors.confirmPassword}
                  />
                </Field>
              </div>

              {/* ── Account type ── */}
              <Field label="Account type" required error={errors.userType}>
                <UserTypeSelector
                  value={form.userType}
                  onChange={handleChange}
                  error={errors.userType}
                />
              </Field>

              {/* ── Terms ── */}
              <div>
                <label
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition-colors hover:bg-slate-100 sm:p-4"
                  htmlFor="terms"
                >
                  {/* Custom checkbox */}
                  <span
                    className={[
                      "mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-all duration-150",
                      form.termsAccepted
                        ? "border-teal-600 bg-teal-600"
                        : "border-slate-300 bg-white",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {form.termsAccepted && (
                      <Check
                        className="h-2.5 w-2.5 text-white"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    id="terms"
                    checked={form.termsAccepted}
                    onChange={handleChange}
                    className="sr-only"
                    aria-required="true"
                  />
                  <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-semibold text-teal-700 hover:underline"
                    >
                      Terms &amp; Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-semibold text-teal-700 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </label>
                {errors.termsAccepted && (
                  <p
                    role="alert"
                    className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-red-600"
                  >
                    <AlertCircle className="h-3 w-3" aria-hidden="true" />
                    {errors.termsAccepted}
                  </p>
                )}
              </div>

              {/* ── Submit button ── */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white shadow-sm transition-all duration-150 hover:bg-teal-800 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5 sm:text-base cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    Creating account…
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    Create account
                  </>
                )}
              </button>

              {/* ── Sign in link ── */}
              <p className="text-center text-xs text-slate-400 sm:text-sm">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="font-semibold text-teal-700 hover:underline"
                >
                  Sign in →
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
