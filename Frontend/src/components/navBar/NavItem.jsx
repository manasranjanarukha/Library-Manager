// Route
import { Link } from "react-router-dom";
// Icons
import { DisclosureButton } from "@headlessui/react";

export default function NavItem({
  item,
  active,
  savedCount,
  variant = "desktop",
  classNames,
  navigation,
}) {
  const Icon = item.icon;

  const isMobile = variant === "mobile";
  const isSaved = item.id === "saved";

  const Component = isMobile ? DisclosureButton : Link;
  return (
    <Component
      {...(isMobile
        ? {
            as: Link,
            to: item.to,
          }
        : {
            to: item.to,
          })}
      aria-current={active ? "page" : undefined}
      className={classNames(
        isMobile
          ? "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
          : "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",

        active
          ? "bg-[#0F766E]/8 text-[#0F766E]"
          : "text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]",
      )}
    >
      {/* Icon */}
      <Icon
        className={classNames(
          isMobile ? "h-5 w-5 flex-shrink-0" : "h-4 w-4",

          active ? "text-[#0F766E]" : "text-[#94A3B8]",
        )}
        aria-hidden="true"
      />

      {/* Label */}
      <span className={isMobile ? "flex-1" : ""}>{item.label}</span>

      {/* Badge */}
      {isSaved && savedCount > 0 && (
        <span
          className={classNames(
            "badge-pop inline-flex items-center justify-center rounded-full bg-[#0F766E] font-bold text-white",

            isMobile
              ? "h-5 min-w-5 px-1.5 text-[10px]"
              : "ml-0.5 h-4 min-w-4 px-1 text-[9px]",
          )}
        >
          {savedCount > 99 ? "99+" : savedCount}
        </span>
      )}

      {/* Active Indicator */}
      {active &&
        (isMobile ? (
          <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E] flex-shrink-0" />
        ) : (
          <span className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#0F766E]" />
        ))}
    </Component>
  );
}
