// Components
import StarDisplay from "./StarDisplay";
export default function ReviewCard({ reviews, index }) {
  const { comment, createdAt, user = {}, rating } = reviews;
  const { fullName, profilePicture } = user;
  const date = createdAt ? new Date(createdAt).toLocaleDateString() : null;

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className="rounded-2xl border border-teal-600 bg-slate-50 p-4 transition-all duration-200 hover:border-black hover:bg-white hover:shadow-sm sm:p-5"
      style={{
        animation: "fadeUp 0.35s ease both",
        animationDelay: `${index * 45}ms`,
      }}
    >
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
            <div className="flex-shrink-0">
              {profilePicture ? (
                <img
                  src={user.profilePicture ? `${user.profilePicture}` : ""}
                  alt={user.fullName || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(fullName)}
                </div>
              )}
            </div>
          </span>
          <div>
            <p className="text-sm font-bold text-slate-800">
              {fullName || "Anonymous"}
            </p>
            {date && <p className="text-[11px] text-slate-400">{date}</p>}
          </div>
        </div>
        {rating > 0 && <StarDisplay rating={rating} />}
      </div>
      <p className="ml-10 text-sm leading-relaxed text-slate-600">{comment}</p>
    </div>
  );
}
