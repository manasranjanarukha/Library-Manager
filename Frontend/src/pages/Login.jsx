import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
  UserPlus,
} from "lucide-react";

import PageMeta from "../components/PageMeta";
import Input from "../components/Login/Input";
import Field from "../components/Login/Field";
import PasswordInput from "../components/Login/PasswordInput";
import ErrorBanner from "../components/Login/ErrorBanner";
import useLogin from "../hooks/useLogin";

function OrDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <div className="h-px flex-1 bg-slate-100" />
      <span className="text-[11px] font-medium text-slate-400">or</span>
      <div className="h-px flex-1 bg-slate-100" />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════ */
export default function Login() {
  const { form, loading, errorMsg, handleChange, handleSubmit } = useLogin();

  return (
    <>
      <PageMeta
        title="Sign In"
        description="Sign in to your Readymate account"
        keywords="login, sign in, reader, author, books, reading platform, book reviews, publish books"
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* ── Page background ── */}
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
        <div className="fade-up w-full max-w-md">
          {/* ── Logo / brand ── */}
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

          {/* ── Card ── */}
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            {/* Card header */}
            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Sign in to continue to your reading dashboard
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5 px-6 py-6 sm:px-8 sm:py-7"
            >
              {/* Error banner */}
              <ErrorBanner
                message={errorMsg}
                role="alert"
                aria-live="assertive"
              />

              {/* Email */}
              <Field label="Email address" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  autoComplete="email"
                  hasError={!!errorMsg}
                  disabled={loading}
                  required
                />
              </Field>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                  >
                    Password
                  </label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-[11px] font-semibold text-teal-700 transition-colors hover:text-teal-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  autoComplete="current-password"
                  hasError={!!errorMsg}
                  disabled={loading}
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !form.email || !form.password}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white shadow-sm transition-all duration-150 hover:bg-teal-800 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5 sm:text-base cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    Sign in
                  </>
                )}
              </button>

              {/* OR divider */}
              <OrDivider />

              {/* Register CTA
                  Mobile: stacked card
                  sm+: horizontal row inside the card
              ── */}
              <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3">
                <p className="text-xs text-slate-500 sm:text-sm">
                  Don't have an account?
                </p>
                <Link
                  to="/auth/register"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-teal-200 bg-white px-4 py-2 text-xs font-bold text-teal-700 transition-all duration-150 hover:border-teal-600 hover:bg-teal-50 active:scale-[0.97] sm:w-auto sm:text-sm"
                >
                  <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                  Create a free account
                </Link>
              </div>
            </form>
          </div>

          {/* Below-card footnote */}
          <p className="mt-6 text-center text-[11px] text-slate-400 sm:text-xs">
            By signing in you agree to our{" "}
            <Link
              to="/terms"
              className="font-semibold text-slate-500 hover:text-teal-700 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-semibold text-slate-500 hover:text-teal-700 hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
