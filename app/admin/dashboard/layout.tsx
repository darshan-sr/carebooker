"use client";
import supabase from "@/utils/supabase";
import { useRouter } from "next/navigation";
import React from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const currentPath = usePathname();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }
    localStorage.clear();
    router.push("/admin/auth/signin");
  };

  // Function to check if the current path matches a given link
  const isActive = (path: string) => currentPath === path;

  return (
    <div className="flex flex-row ">
      <aside
        id="default-sidebar"
        className=" top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidenav"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <a
            href="#"
            className="flex mb-4 items-center border-b border-gray-200 pb-4 space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Carebooker Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Carebooker
            </span>
          </a>
          <ul className="space-y-2">
            <li>
              <a
                href="/admin/dashboard"
                className={`flex items-center p-2 text-base font-normal rounded-lg group ${
                  isActive("/admin/dashboard")
                    ? "bg-blue-600 text-white"
                    : "text-gray-900"
                } dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <span className="ml-3">Manage Doctors</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/dashboard/patients"
                className={`flex items-center p-2 text-base font-normal rounded-lg group ${
                  isActive("/admin/dashboard/patients")
                    ? "bg-blue-600 text-white"
                    : "text-gray-900"
                } dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <span className="ml-3">Manage Patients</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/dashboard/generate-bills"
                className={`flex items-center p-2 text-base font-normal rounded-lg group ${
                  isActive("/admin/dashboard/generate-bills")
                    ? "bg-blue-600 text-white"
                    : "text-gray-900"
                } dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <span className="ml-3">Generate Bills</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/dashboard/view-bills"
                className={`flex items-center p-2 text-base font-normal rounded-lg group ${
                  isActive("/admin/dashboard/view-bills")
                    ? "bg-blue-600 text-white"
                    : "text-gray-900"
                } dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <span className="ml-3">View Bills</span>
              </a>
            </li>
          </ul>
          <a
            onClick={handleSignOut}
            className="flex absolute  bottom-6 items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg
              className="flex-shrink-0 w-5 h-5 text-red-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
              />
            </svg>
            <span className="flex-1 ms-3 text-gray-800 whitespace-nowrap">
              Sign Out
            </span>
          </a>
        </div>
      </aside>
      <section>{children}</section>
    </div>
  );
}
