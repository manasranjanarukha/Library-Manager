export default function SkeletonGrid({ cols }) {
  return (
    <div className={`grid gap-3 p-4 ${cols}`}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl border border-slate-100"
        >
          <div className="bg-slate-200" style={{ aspectRatio: "2/3" }} />
          <div className="space-y-2 p-2">
            <div className="h-2.5 w-3/4 rounded bg-slate-200" />
            <div className="h-2 w-1/2 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
