import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Link, useLocation } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const { user, logout } = useContext(UserContext);

  const location = useLocation();
  const role = user?.userType?.toLowerCase();
  const authorNavigation = [
    { name: "Add Book", to: "/books/add", current: true },
    { name: "My Book", to: `/authors/:${user?.id}/books`, current: false },
  ];

  const readerNavigation = [
    { name: "Favorite Book", href: "#", current: true },
  ];
  const navigation = role === "author" ? authorNavigation : readerNavigation;
  return (
    <Disclosure
      as="nav"
      className="relative bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-black-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link to={"/"}>
              <div className="flex shrink-0 items-center">
                <img
                  alt="Company"
                  src="https://i.pinimg.com/originals/f4/cf/ec/f4cfec4f3b4bbf24798b26aa4a5508f2.png"
                  className="h-8 w-auto"
                />
              </div>
            </Link>

            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {user ? (
                  // ✅ Show role-based navigation when logged in
                  navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={classNames(
                        "rounded-md px-3 py-2 text-sm font-medium", // always applied
                        location.pathname === item.to
                          ? "bg-gray-950/50 text-white" // active
                          : "text-gray-300 hover:bg-white/5 hover:text-white" // inactive
                      )}
                    >
                      {item.name}
                    </Link>
                  ))
                ) : (
                  // ✅ Show Login/Register when logged out
                  <>
                    <Link
                      to="/auth/login"
                      className="px-3 py-2 rounded-md text-sm lg:text-base font-medium hover:bg-blue-800 hover:text-blue-100 transition-all duration-200 transform hover:scale-105"
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth/register"
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-sm lg:text-base font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg "
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            {user ? (
              <Menu as="div" className="relative ml-3">
                <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt={user?.fullName}
                    src={
                      user.profilePicture
                        ? `${API_URL}/uploads/users/profilePictures/${user.profilePicture}`
                        : "/public/book-avatar.png"
                    }
                    className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                  />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden">
                    Hello, {user?.fullName}
                  </div>
                  <MenuItem>
                    <Link
                      to={"/me"}
                      className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                    >
                      Your profile
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    <button
                      onClick={logout}
                      className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden cursor-pointer w-full text-left hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              aria-current={location.pathname === item.to ? "page" : undefined}
              className={classNames(
                location.pathname === item.to
                  ? "bg-gray-950/50 text-white" // active state
                  : "text-gray-300 hover:bg-white/5 hover:text-white", // inactive
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
