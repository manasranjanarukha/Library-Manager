function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
      <div className="flex gap-0">
        <div className="w-[110px] sm:w-[130px] min-h-[170px] bg-slate-200 flex-shrink-0" />
        <div className="flex-1 p-4 space-y-3">
          <div className="h-4 bg-slate-200 rounded-full w-3/4" />
          <div className="h-3 bg-slate-100 rounded-full w-1/2" />
          <div className="h-3 bg-slate-100 rounded-full w-full" />
          <div className="h-3 bg-slate-100 rounded-full w-5/6" />
          <div className="h-8 bg-slate-200 rounded-xl w-full mt-4" />
        </div>
      </div>
    </div>
  );
}

export default function SkeletonList({
  count = 4,
  className = "",
  itemClassName = "",
}) {
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={itemClassName}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}
