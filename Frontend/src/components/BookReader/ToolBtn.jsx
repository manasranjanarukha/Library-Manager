import { Children } from "react";

export default function ToolBtn({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-colors duration-150 hover:bg-white/10 hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
    >
      {children}
    </button>
  );
}
