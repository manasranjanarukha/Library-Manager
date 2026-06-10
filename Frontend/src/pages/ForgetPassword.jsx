import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Mail,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import {
  forgotPassword,
  verifyCaptcha,
  resetPassword,
} from "../service/userService";
import PageMeta from "../components/PageMeta";
import StepStrip from "../components/ForgetPassword/StepStrip";
import Input from "../components/ForgetPassword/Input";
import PasswordInput from "../components/ForgetPassword/PasswordInput";
import FieldLabel from "../components/ForgetPassword/FieldLabel";
import ErrorBanner from "../components/ForgetPassword/ErrorBanner";
import SuccessBanner from "../components/ForgetPassword/SuccessBanner";
import SuccessScreen from "../components/ForgetPassword/SuccessScreen";

function CaptchaBox({ value }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-600">
          Your captcha
        </p>
        <p
          className="mt-0.5 font-mono text-xl font-black tracking-[0.25em] text-teal-800"
          aria-label={`Captcha: ${value}`}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy captcha"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-200 bg-white text-teal-600 transition-all hover:bg-teal-100 active:scale-95"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-teal-600" strokeWidth={3} />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

const initialState = {
  step: 1,
  loading: false,
  error: "",
  captchaData: null,
  captchaOk: "",
  form: {
    email: "",
    captcha: "",
    newPassword: "",
  },
};

function forgotPasswordReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: action.value,
        },
        error: "",
      };

    case "START_LOADING":
      return {
        ...state,
        loading: true,
        error: "",
      };

    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "EMAIL_SUCCESS":
      return {
        ...state,
        step: 2,
        captchaData: action.payload,
        error: "",
      };

    case "CAPTCHA_SUCCESS":
      return {
        ...state,
        step: 3,
        captchaOk: action.payload,
        error: "",
      };

    case "PASSWORD_RESET_SUCCESS":
      return {
        ...state,
        step: 4,
      };

    default:
      return state;
  }
}
export default function ForgetPassword() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(forgotPasswordReducer, initialState);
  const { step, loading, error, captchaData, captchaOk, form } = state;
  function handleChange(e) {
    const { name, value } = e.target;
    dispatch({
      type: "UPDATE_FIELD",
      field: name,
      value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    dispatch({ type: "START_LOADING" });

    try {
      /* ── Step 1: send email, get captcha ── */
      if (step === 1) {
        const res = await forgotPassword(form.email);
        if (!res.success) {
          dispatch({
            type: "SET_ERROR",
            payload: res.message,
          });
          return;
        }
        dispatch({
          type: "EMAIL_SUCCESS",
          payload: res,
        });
        return;
      }

      /* ── Step 2: verify captcha ── */
      if (step === 2) {
        const res = await verifyCaptcha(form.email, form.captcha);
        if (!res.success) {
          dispatch({
            type: "SET_ERROR",
            payload: res.message,
          });
          return;
        }
        dispatch({
          type: "CAPTCHA_SUCCESS",
          payload: res.message || "Captcha verified successfully.",
        });
        return;
      }

      /* ── Step 3: reset password ── */
      if (step === 3) {
        const res = await resetPassword(form.email, form.newPassword);
        if (!res.success) {
          dispatch({
            type: "SET_ERROR",
            payload: res.message,
          });
          return;
        }
        dispatch({
          type: "PASSWORD_RESET_SUCCESS",
        });
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
      dispatch({
        type: "SET_ERROR",
        payload: "Something went wrong. Please try again.",
      });
    } finally {
      dispatch({ type: "STOP_LOADING" });
    }
  }

  /* Step meta for heading */
  const stepMeta = {
    1: {
      title: "Forgot password?",
      sub: "Enter your email and we'll send a captcha",
    },
    2: {
      title: "Verify captcha",
      sub: "Enter the captcha shown below to continue",
    },
    3: {
      title: "New password",
      sub: "Choose a strong password for your account",
    },
    4: { title: "All done!", sub: "Your password has been updated" },
  };

  /* Button label */
  const btnLabel = {
    1: "Send captcha",
    2: "Verify captcha",
    3: "Update password",
    4: "Done",
  }[step];

  return (
    <>
      <PageMeta
        title="Reset password — Readymate"
        description="Reset your Readymate account password in three quick steps."
        keywords="reset password, forgot password, account recovery"
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
        <div className="fade-up w-full max-w-md">
          {/* ── Brand ── */}
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
              {/* Back to login link */}
              <Link
                to="/auth/login"
                className="mb-4 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 transition-colors hover:text-teal-700"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back to sign in
              </Link>

              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                {stepMeta[step].title}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {stepMeta[step].sub}
              </p>
            </div>

            {/* Step strip */}
            <div className="border-b border-slate-100 px-6 py-4 sm:px-8">
              <StepStrip current={step} />
            </div>

            {/* Form body */}
            <div className="px-6 py-6 sm:px-8 sm:py-7">
              {step === 4 ? (
                <SuccessScreen navigate={navigate} />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  {/* Error */}
                  <ErrorBanner message={error} />

                  {/* ── Step 1: Email ── */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>Email address</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      autoComplete="email"
                      hasError={!!error && step === 1}
                      disabled={step > 1 || loading}
                      required
                    />
                  </div>

                  {/* ── Step 2: Captcha ── */}
                  {step >= 2 && (
                    <div
                      className="flex flex-col gap-3"
                      style={{ animation: "fadeUp 0.35s ease both" }}
                    >
                      {/* Captcha display box */}
                      {captchaData?.captcha && (
                        <CaptchaBox value={captchaData.captcha} />
                      )}

                      <div className="flex flex-col gap-1.5">
                        <FieldLabel>Enter captcha</FieldLabel>
                        <Input
                          id="captcha"
                          name="captcha"
                          type="text"
                          value={form.captcha}
                          onChange={handleChange}
                          placeholder="Type the captcha above"
                          autoComplete="off"
                          hasError={!!error && step === 2}
                          disabled={step > 2 || loading}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* ── Step 3: New password ── */}
                  {step >= 3 && (
                    <div
                      className="flex flex-col gap-3"
                      style={{ animation: "fadeUp 0.35s ease both" }}
                    >
                      {/* Captcha verified success */}
                      <SuccessBanner message={captchaOk} />

                      <div className="flex flex-col gap-1.5">
                        <FieldLabel>New password</FieldLabel>
                        <PasswordInput
                          id="newPassword"
                          name="newPassword"
                          value={form.newPassword}
                          onChange={handleChange}
                          placeholder="Min. 8 characters"
                          autoComplete="new-password"
                          hasError={!!error && step === 3}
                          disabled={loading}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white shadow-sm transition-all duration-150 hover:bg-teal-800 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Processing…
                      </>
                    ) : (
                      btnLabel
                    )}
                  </button>

                  {/* Sign-in redirect */}
                  <p className="text-center text-xs text-slate-400">
                    Remember your password?{" "}
                    <Link
                      to="/auth/login"
                      className="font-semibold text-teal-700 hover:underline"
                    >
                      Sign in →
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Below-card footnote */}
          <p className="mt-6 text-center text-[11px] text-slate-400">
            Need help?{" "}
            <a
              href="mailto:support@readymate.com"
              className="font-semibold text-slate-500 hover:text-teal-700 hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
