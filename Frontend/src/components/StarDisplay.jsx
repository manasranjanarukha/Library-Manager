// Icons
import { Star } from "lucide-react";
export default function StarDisplay({ rating, size = "sm" }) {
  const cls = size === "lg" ? "h-4 w-4 " : "h-3.5 w-3.5 ";
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${cls} ${
            n <= rounded
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-100 text-black "
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
