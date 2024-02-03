"use client";
import HeaderSection from "@/components/HeaderSection";
import React, { useEffect } from "react";
import { Datepicker } from "flowbite-react";
import supabase from "@/utils/supabase";
import { useRouter } from "next/navigation";

const PatientSignInPage = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] =
    React.useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    // Check if patient email exists in the 'patient' table

    let { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*");

    if (adminError) {
      setError("No Records found");
      setIsLoading(false);
      return;
    }
    console.log(adminUser);
    // If patient email doesn't exist, handle the situation accordingly
    if (!adminUser || adminUser.length === 0) {
      setError("Invalid Records");
      setIsLoading(false);
      // You might want to display an error message to the user or take some other action.
      return;
    }

    // Patient email exists, proceed with sign-in
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    } else {
      console.log("User signed in successfully:", signInData);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(signInData));
        localStorage.setItem("userType", "admin");
      }
      setIsLoading(false);
      router.push("/admin/dashboard");
    }
  };

  return (
    <>
      <HeaderSection />

      <form
        className="max-w-md mt-[20vh] mb-24 mx-auto border border-gray-200 p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
        <h4 className="block my-5 text-lg w-full text-center font-semibold  text-blue-600 dark:text-white ">
          Admin Login
        </h4>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your email address"
            required
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
            {isPasswordVisible ? (
              <svg
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="w-6 h-6 text-gray-800 dark:text-white absolute top-2 right-3 cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 14c-.5-.6-.9-1.3-1-2 0-1 4-6 9-6m7.6 3.8A5 5 0 0 1 21 12c0 1-3 6-9 6h-1m-6 1L19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            ) : (
              <svg
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="w-6 h-6 text-gray-800 dark:text-white absolute top-2 right-3 cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  d="M21 12c0 1.2-4 6-9 6s-9-4.8-9-6c0-1.2 4-6 9-6s9 4.8 9 6Z"
                />
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            )}
          </div>
        </div>

        {error && (
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isLoading ? "Loading..." : "Log In"}
        </button>
      </form>
    </>
  );
};

export default PatientSignInPage;
