"use client";
import supabase from "@/utils/supabase";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AppointmentForm from "@/components/AppointmentForm";
import CurrentAppointments from "@/components/CurrentAppointments";
import PatientMedicalRecords from "@/components/PatientMedicalRecords";
import PatientPastAppointments from "@/components/PatientPastAppointments";
import PatientViewBills from "@/components/PatientBill";

const PatientDashboard = () => {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Book an appointment");

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
          // Query the 'patient' table for the user's email
          const { data: patientData, error: patientError } = await supabase
            .from("patient")
            .select("*")
            .eq("email", userEmail);

          if (patientError) {
            console.error("Error fetching patient data:", patientError.message);
            return;
          }

          if (patientData && patientData.length > 0) {
            // If patient data is found, log it or do something with it
            console.log("Patient data:", patientData[0]);
            setUserDetails(patientData[0]);
            // You may want to set the patient data to the state or perform other actions
          } else {
            console.log("Patient data not found.");
            // Handle the case where no patient data is found for the user's email
          }
        }
      }
    };

    getUser();
  }, []);

  const tabs = [
    "Book an appointment",
    "Current appointments",
    "Past appointments",
    "Medical Records",
    "Medical Bills",
  ];

  console.log(userDetails);
  console.log(user);

  return (
    <>
      <div className="text-sm min-w-full w-[80vw] pt-[10px] px-10 font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <li className="me-2" key={tab}>
              <a
                href="#"
                className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${
                  activeTab === tab
                    ? "text-blue-600  bg-blue-100 border-b border-blue-600"
                    : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {activeTab === "Book an appointment" && <AppointmentForm />}
        {activeTab === "Current appointments" && <CurrentAppointments />}
        {activeTab === "Past appointments" && <PatientPastAppointments />}
        {activeTab === "Medical Records" && <PatientMedicalRecords />}
        {activeTab === "Medical Bills" && <PatientViewBills />}
      </div>
    </>
  );
};

export default PatientDashboard;
