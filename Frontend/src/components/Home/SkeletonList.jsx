import SkeletonCard from "./SkeletonCard";
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
