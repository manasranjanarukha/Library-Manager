// React
import React from "react";
// Icons
import { DisclosureButton, DisclosurePanel } from "@headlessui/react";
// Route
import { Link } from "react-router-dom";
// Icons
import {
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import NavItem from "./NavItem";
export default function MobileNav({
  user,
  location,
  navigation,
  savedCount,
  role,
  NAV_ICONS,
  classNames,
  logout,
  open,
  initials,
}) {
  return (
    <>
      <DisclosurePanel
        as="div"
        className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 sm:hidden mobile-panel-enter
              
              absolute left-0 top-full z-50 w-full bg-white "
      >
        {user ? (
          <>
            {/* User info card */}
            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-[#0F766E]/5 border border-[#0F766E]/10 p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#0F766E]/20 bg-[#0F766E]/10">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user?.fullName}'s avatar`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-sm font-bold text-[#0F766E]">
                    {initials}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#1E293B]">
                  {user?.fullName}
                </p>
                <span className="inline-flex items-center rounded-full bg-[#0F766E]/10 px-2 py-0.5 text-[11px] font-semibold capitalize text-[#0F766E]">
                  {role}
                </span>
              </div>
              {/* Saved count chip */}
              {savedCount > 0 && (
                <div className="flex-shrink-0 flex flex-col items-center">
                  <span className="badge-pop inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#0F766E] px-1.5 text-[10px] font-bold text-white">
                    {savedCount}
                  </span>
                  <span className="text-[9px] text-[#64748B] mt-0.5 font-medium">
                    saved
                  </span>
                </div>
              )}
            </div>

            {/* Nav links */}
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  active={location.pathname === item.to}
                  savedCount={savedCount}
                  variant="mobile"
                  classNames={classNames}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-slate-100" />

            {/* Profile & sign out */}
            <div className="space-y-1">
              <DisclosureButton
                as={Link}
                to="/me"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#64748B] transition-colors hover:bg-slate-50 hover:text-[#1E293B]"
              >
                <UserCircleIcon
                  className="h-5 w-5 text-[#94A3B8]"
                  aria-hidden="true"
                />
                Your Profile
              </DisclosureButton>

              <DisclosureButton
                as="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#DC2626] transition-colors hover:bg-[#DC2626]/6"
              >
                <ArrowRightStartOnRectangleIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
                Sign out
              </DisclosureButton>
            </div>
          </>
        ) : (
          /* Guest mobile */
          <div className="space-y-2.5 pt-1">
            <DisclosureButton
              as={Link}
              to="/auth/login"
              className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#64748B] transition-colors hover:bg-slate-50"
            >
              Login
            </DisclosureButton>
            <DisclosureButton
              as={Link}
              to="/auth/register"
              className="flex w-full items-center justify-center rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d6560]"
            >
              Get Started
            </DisclosureButton>
          </div>
        )}
      </DisclosurePanel>
    </>
  );
}
