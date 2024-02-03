"use client";
import supabase from "@/utils/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface ChildProps {
  user: any;
  userDetails: any;
}

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }
    localStorage.clear();
    router.push("/Doctor/auth/signin");
  };

  useEffect(() => {
    const getUser = async () => {
      // Get the current user from Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        // Check if the user has an email
        const userEmail = user.email;

        if (userEmail) {
          // Query the 'Doctor' table for the user's email
          const { data: DoctorData, error: DoctorError } = await supabase
            .from("doctor")
            .select("*")
            .eq("email", userEmail);

          if (DoctorError) {
            console.error("Error fetching Doctor data:", DoctorError.message);
            return;
          }

          if (DoctorData && DoctorData.length > 0) {
            // If Doctor data is found, log it or do something with it
            console.log("Doctor data:", DoctorData[0]);
            setUserDetails(DoctorData[0]);
            // You may want to set the Doctor data to the state or perform other actions
          } else {
            console.log("Doctor data not found.");
            // Handle the case where no Doctor data is found for the user's email
          }
        }
      }
    };

    getUser();
  }, []);

  return (
    <div className="flex flex-row">
      <section
        id="default-sidebar"
        className=" z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full  px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <a
            href="#"
            className="flex items-center border-b border-gray-200 pb-4 space-x-3 rtl:space-x-reverse"
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
          <div className="w-full flex flex-col items-center justify-center ">
            <span className="self-center border-b border-gray-200 pb-4 w-full flex justify-center  text-md font-semibold text-blue-600 my-6 whitespace-nowrap dark:text-white">
              Doctor Dashboard
            </span>
            <a
              href="#"
              className="block gap-4 my-2 w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <div className="w-full flex my-4 items-center justify-center">
                <Image
                  src="/default.jpg"
                  alt="user"
                  width={120}
                  height={120}
                  className="rounded-[50%]"
                />
              </div>
              <h5 className="mb-2 text-xl text-center w-full font-bold tracking-tight text-gray-900 dark:text-white">
                {userDetails?.name}
              </h5>
              <p className="font-semibold text-gray-700 text-sm  dark:text-gray-400">
                Your Details:
              </p>
              <p className="font-normal flex flex-row text-sm text-gray-700 dark:text-gray-400">
                <span className="font-semibold text-blue-600">Email: </span>
                {" " + userDetails?.email}
              </p>
              <p className="font-normal flex flex-row text-sm text-gray-700 dark:text-gray-400">
                <span className="font-semibold text-blue-600">Phone: </span>
                {" " + userDetails?.contact_no}
              </p>
              <p className="font-normal flex flex-row text-sm text-gray-700 dark:text-gray-400">
                <span className="font-semibold text-blue-600">Doctor ID: </span>
                {"DOC" + userDetails?.doctor_id}
              </p>
              <p className="font-normal flex flex-row text-sm text-gray-700 dark:text-gray-400">
                <span className="font-semibold text-blue-600">
                  Specialization:
                </span>
                {userDetails?.specialization}
              </p>
            </a>
          </div>

          <ul className="space-y-2 font-medium">
            <li>
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
            </li>
          </ul>
        </div>
      </section>
      <section>{children}</section>
    </div>
  );
}
