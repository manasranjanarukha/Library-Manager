export default function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  iconColor = "text-teal-700",
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <span className={`mt-0.5 ${iconColor}`} aria-hidden="true">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#1E293B] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
