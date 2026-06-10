// React
import { useContext, useState } from "react";

// Router
import { Link, useLocation } from "react-router-dom";

// Headless UI
import { Disclosure, DisclosureButton } from "@headlessui/react";

// Heroicons
import {
  Bars3Icon,
  XMarkIcon,
  BookmarkIcon,
  PlusCircleIcon,
  BookOpenIcon as BookListIcon,
} from "@heroicons/react/24/outline";

// Contexts
import { UserContext } from "../../context/userContext";
import { useSaveForLater } from "../../context/SaveForLaterContext";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";
import MobileNav from "./MobileNav";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ── Icon map for nav items ── */
const NAV_ICONS = {
  "Add Book": PlusCircleIcon,
  "My Books": BookListIcon,
  "Saved for Later": BookmarkIcon,
};

export default function NavBar() {
  const { user, logout } = useContext(UserContext);
  const { saveForLaterBooks = [] } = useSaveForLater();
  const location = useLocation();
  const [bellOpen, setBellOpen] = useState(false);

  const role = user?.userType?.toLowerCase() || "reader";

  const authorNavigation = [
    {
      id: "add-book",
      label: "Add Book",
      to: `/${user?._id}/books/add`,
      icon: PlusCircleIcon,
    },

    {
      id: "my-books",
      label: "My Books",
      to: `/authors/${user?._id}/books`,
      icon: BookListIcon,
    },
  ];
  const readerNavigation = [
    {
      id: "saved",
      label: "Saved for Later",
      to: `/reader/${user?._id}/save-for-later`,
      icon: BookmarkIcon,
    },
  ];
  const navigation = role === "author" ? authorNavigation : readerNavigation;

  /* Avatar initials fallback */
  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const savedCount = saveForLaterBooks.length;

  return (
    <>
      {/* ── Keyframe definitions ── */}
      <style>{`
        @keyframes bellPanelIn {
          from { opacity: 0; transform: scale(0.95) translateY(-6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes badgePop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        .badge-pop { animation: badgePop 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        .mobile-panel-enter { animation: mobileMenuIn 0.22s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <Disclosure
        as="nav"
        aria-label="Main navigation"
        className="sticky  top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md backdrop-saturate-150 shadow-[0_1px_12px_rgba(15,118,110,0.06)]"
      >
        {({ open }) => (
          <>
            {/* ════════════════════════════
                TOP BAR
            ════════════════════════════ */}
            <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between gap-3 px-4 sm:text-green ">
              {/* ── Logo ── */}
              <Logo />

              {/* ── Desktop nav links ── */}
              <DesktopNav
                user={user}
                location={location}
                navigation={navigation}
                savedCount={savedCount}
                classNames={classNames}
                pathname={location.pathname}
              />

              {/* Spacer when logged out */}
              {!user && <div className="hidden flex-1 sm:block" />}

              {/* ── Right actions ── */}
              <div className="flex items-center gap-1.5">
                {/* ── Bell button + panel ── */}
                <NotificationBell
                  savedCount={savedCount}
                  saveForLaterBooks={saveForLaterBooks}
                  user={user}
                  classNames={classNames}
                />
                {/* ── Guest: login / register ── */}
                {!user && (
                  <div className="hidden items-center gap-2 sm:flex">
                    <Link
                      to="/auth/login"
                      className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-[#64748B] transition-colors hover:bg-slate-100 hover:text-[#1E293B]"
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth/register"
                      className="rounded-lg bg-[#0F766E] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:bg-[#0d6560] hover:shadow-md active:translate-y-0"
                    >
                      Get Started
                    </Link>
                  </div>
                )}

                {/* ── Avatar dropdown (desktop, logged in) ── */}
                <UserMenu
                  user={user}
                  role={role}
                  savedCount={savedCount}
                  logout={logout}
                  classNames={classNames}
                  initials={initials}
                />

                {/* ── Hamburger (mobile only) ── */}
                <DisclosureButton
                  aria-label={open ? "Close menu" : "Open menu"}
                  className={classNames(
                    "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 sm:hidden",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]",
                    open
                      ? "border-[#0F766E]/25 bg-[#0F766E]/8 text-[#0F766E]"
                      : "border-slate-200 text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]",
                  )}
                >
                  {/* Animated hamburger → X */}
                  <span className="relative w-5 h-5 flex items-center justify-center">
                    <Bars3Icon
                      className={classNames(
                        "absolute h-5 w-5 transition-all duration-200",
                        open
                          ? "opacity-0 rotate-45 scale-75"
                          : "opacity-100 rotate-0 scale-100",
                      )}
                      aria-hidden="true"
                    />
                    <XMarkIcon
                      className={classNames(
                        "absolute h-5 w-5 transition-all duration-200",
                        open
                          ? "opacity-100 rotate-0 scale-100"
                          : "opacity-0 -rotate-45 scale-75",
                      )}
                      aria-hidden="true"
                    />
                  </span>
                </DisclosureButton>
              </div>
            </div>

            {/* ════════════════════════════
                MOBILE PANEL
            ════════════════════════════ */}

            <MobileNav
              user={user}
              location={location}
              navigation={navigation}
              savedCount={savedCount}
              role={role}
              NAV_ICONS={NAV_ICONS}
              classNames={classNames}
              logout={logout}
              pathname={location.pathname}
            />
          </>
        )}
      </Disclosure>
    </>
  );
}
