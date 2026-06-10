import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
// Icons
import {
  ArrowRightStartOnRectangleIcon,
  BookmarkIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
// Route
import { Link } from "react-router-dom";

export default function UserMenu({
  user,
  role,
  savedCount,
  logout,
  classNames,
  initials,
}) {
  return (
    <>
      {user && (
        <Menu as="div" className="relative hidden sm:block">
          <MenuButton className="group flex items-center gap-2 rounded-xl border border-transparent p-1 pr-2 transition-all duration-150 hover:border-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] cursor-pointer">
            {/* Avatar circle */}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-[#0F766E]/10">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={`${user?.fullName}'s avatar`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-xs font-bold text-[#0F766E]">
                  {initials}
                </span>
              )}
            </span>
            <span className="hidden max-w-[100px] truncate text-sm font-semibold text-[#1E293B] lg:block">
              {user?.fullName?.split(" ")[0]}s
            </span>
            <ChevronDownIcon
              className="h-3.5 w-3.5 text-[#94A3B8] transition-transform duration-200 group-data-[open]:rotate-180"
              aria-hidden="true"
            />
          </MenuButton>

          <MenuItems
            as="div"
            transition
            className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white p-1.5 shadow-[0_8px_32px_rgba(15,118,110,0.12)] focus:outline-none transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-150 data-[leave]:duration-100"
          >
            {/* User info header */}
            <div className="mb-1 border-b border-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                Signed in as
              </p>
              <p className="mt-0.5 truncate text-sm font-bold text-[#1E293B]">
                {user?.fullName}
              </p>
              <span className="mt-1 inline-flex items-center rounded-full bg-[#0F766E]/8 px-2 py-0.5 text-[11px] font-semibold capitalize text-[#0F766E] border border-[#0F766E]/15">
                {role}
              </span>
            </div>

            <MenuItem>
              {({ focus }) => (
                <Link
                  to="/me"
                  className={classNames(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    focus ? "bg-slate-50 text-[#1E293B]" : "text-[#64748B]",
                  )}
                >
                  <UserCircleIcon
                    className="h-4 w-4 text-[#94A3B8]"
                    aria-hidden="true"
                  />
                  Your Profile
                </Link>
              )}
            </MenuItem>

            {/* Saved for later quick link */}
            <MenuItem>
              {({ focus }) => (
                <Link
                  to={`/reader/${user._id}/save-for-later`}
                  className={classNames(
                    "flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    focus ? "bg-[#0F766E]/6 text-[#0F766E]" : "text-[#64748B]",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <BookmarkIcon
                      className="h-4 w-4 text-[#94A3B8]"
                      aria-hidden="true"
                    />
                    Reading List
                  </span>
                  {savedCount > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0F766E] px-1.5 text-[10px] font-bold text-white">
                      {savedCount > 99 ? "99+" : savedCount}
                    </span>
                  )}
                </Link>
              )}
            </MenuItem>

            <div className="my-1 h-px bg-slate-50" />

            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={logout}
                  className={classNames(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                    focus ? "bg-[#DC2626]/6 text-[#DC2626]" : "text-[#64748B]",
                  )}
                >
                  <ArrowRightStartOnRectangleIcon
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  Sign out
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      )}
    </>
  );
}
