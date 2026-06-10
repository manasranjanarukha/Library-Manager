import * as LucideIcons from "lucide-react";
import StatCard from "./StatsCard";

export default function StatsBar({ stats }) {
  console.log(stats);

  return (
    <section
      aria-label="Dashboard statistics"
      className="animate-[fadeUp_0.35s_ease_both]"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={LucideIcons.BookOpen}
          label="Total books"
          value={stats.total}
          sub={`${stats.published} published · ${stats.drafts} drafts`}
        />
        <StatCard
          icon={LucideIcons.Star}
          label="Avg. rating"
          value={stats.avgRating}
          sub="across all books"
          iconColor="text-amber-500"
          iconBg="bg-amber-50"
        />
        <StatCard
          icon={LucideIcons.Bookmark}
          label="Total saves"
          value={stats.totalSaves.toLocaleString()}
          sub="readers saved your books"
          iconColor="text-[#0891B2]"
          iconBg="bg-[#0891B2]/8"
        />
        <StatCard
          icon={LucideIcons.Award}
          label="Top genre"
          value={stats.topGenre}
          sub="most books written"
          iconColor="text-violet-500"
          iconBg="bg-violet-50"
        />
      </div>
    </section>
  );
}
