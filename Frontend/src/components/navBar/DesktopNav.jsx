// React
import React from "react";
// Route
import { Link } from "react-router-dom";
// Icons
import { BookOpenIcon } from "@heroicons/react/24/outline";
// Components
import NavItem from "./NavItem";
export default function DesktopNav({
  user,
  location,
  navigation,
  savedCount,
  classNames,
  pathname,
}) {
  return (
    <>
      {user && (
        <nav
          className="hidden flex-1 items-center gap-1 pl-6 sm:flex"
          aria-label="Primary"
        >
          {navigation.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={pathname === item.to}
              savedCount={savedCount}
              classNames={classNames}
              navigation={navigation}
            />
          ))}
        </nav>
      )}
    </>
  );
}
