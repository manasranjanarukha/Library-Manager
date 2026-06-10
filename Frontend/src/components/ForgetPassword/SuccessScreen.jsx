import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
export default function SuccessScreen({ navigate }) {
  useEffect(() => {
    const t = setTimeout(() => navigate("/auth/login"), 4000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
        <CheckCircle2 className="h-8 w-8 text-teal-600" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-800">Password updated!</h2>
        <p className="mt-1 text-sm text-slate-400">
          Redirecting you to sign in…
        </p>
      </div>
      <Link
        to="/auth/login"
        className="mt-2 flex items-center gap-1.5 rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-800 active:scale-[0.97]"
      >
        Sign in now
      </Link>
    </div>
  );
}
