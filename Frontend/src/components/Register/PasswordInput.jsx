import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Input from "./Input";
export default function PasswordInput({
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
  const [show, setShow] = useState(false);

  const strength = (() => {
    if (!value) return 0;
    let s = 0;
    if (value.length >= 8) s++;
    if (/[A-Z]/.test(value)) s++;
    if (/[0-9]/.test(value)) s++;
    if (/[^A-Za-z0-9]/.test(value)) s++;
    return s;
  })();

  const strengthColor = [
    "bg-slate-200",
    "bg-red-400",
    "bg-amber-400",
    "bg-teal-500",
    "bg-teal-600",
  ][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={error}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
        >
          {show ? (
            <EyeOff className="h-4 w-4 " aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Strength bar — only for password field (not confirm) */}
      {name === "password" && value && (
        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  n <= strength ? strengthColor : "bg-slate-100"
                }`}
              />
            ))}
          </div>
          {strengthLabel && (
            <span
              className={`text-[10px] font-semibold ${
                strength <= 1
                  ? "text-red-500"
                  : strength === 2
                    ? "text-amber-500"
                    : "text-teal-600"
              }`}
            >
              {strengthLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
