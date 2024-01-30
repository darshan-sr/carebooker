"use client";
import HeaderSection from "@/components/HeaderSection";
import React, { useEffect } from "react";
import { Datepicker } from "flowbite-react";
import supabase from "@/utils/supabase";
import { sign } from "crypto";
import { useRouter } from "next/navigation";

const PatientSignupPage = () => {
  const [name, setName] = React.useState<string>(""); // [state, setState
  const [date, setDate] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [contact, setContact] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Insert data into 'patient' table
    const { data, error } = await supabase.from("patient").upsert([
      {
        name,
        date_of_birth: date,
        address,
        contact_number: contact,
        email,
        password,
      },
    ]);

    if (error) {
      console.error(
        "Error inserting data into 'patient' table:",
        error.message
      );
      setIsLoading(false);
      return;
    }

    // Sign up user using email and password
    const {
      user,
      session,
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error("Error signing up user:", signUpError.message);
      setIsLoading(false);
      return;
    }

    console.log("User signed up successfully:", user);

    // Sign in user using email and password
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      console.log("Error signing in user:", signInError.message);
      setIsLoading(false);
      return;
    } else {
      console.log("User signed in successfully:", signInData);
      setIsLoading(false);
      router.push("/patient/dashboard");
    }

    // Optionally, you can do something with the user or redirect to another page.
  };

  return (
    <>
      <HeaderSection />

      <form
        className="max-w-md mt-[5vh] mb-24 mx-auto border border-gray-200 p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
        <h4 className="block my-5 text-lg w-full text-center font-semibold  text-blue-600 dark:text-white ">
          Patient Registration
        </h4>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ">
            Full name
          </label>
          <input
            type="name"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your full name"
            required
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Date of birth
          </label>
          <Datepicker
            required
            onSelect={(event) => setDate(event.currentTarget.value)}
          />
        </div>
        {/* <button onClick={() => console.log(date)}>click</button> */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Address
          </label>
          <textarea
            id="message"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your address here"
            required
            onChange={(event) => setAddress(event.currentTarget.value)}
          ></textarea>
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Contact
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 19 18"
              >
                <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
              </svg>
            </div>
            <input
              type="text"
              id="phone-input"
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="+91 98765 43210"
              required
              onChange={(event) => setContact(event.currentTarget.value)}
            />
          </div>
        </div>
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
            Your password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Choose a password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default PatientSignupPage;
