"use client";
import supabase from "@/utils/supabase";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AppointmentForm from "@/components/AppointmentForm";
import CurrentAppointments from "@/components/CurrentAppointments";
import DoctorAppointments from "@/components/DoctorAppointments";
import DoctorPastAppointments from "@/components/DoctorPastAppointments";
import DoctorMedicalRecords from "@/components/DoctorMedicalRecords";

const PatientDashboard = () => {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Your appointments");

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
            .from("doctor")
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

  const tabs = ["Your appointments", "Past appointments", "Medical Records"];

  console.log(userDetails);
  console.log(user);

  return (
    <>
      <div className="min-h-screen min-w-full w-[80vw] dark:bg-gray-700">
        <div className="text-sm  pt-[10px] px-10 font-medium text-center text-gray-500 border-b border-gray-200  dark:text-gray-400 dark:border-gray-500">
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
          {activeTab === "Your appointments" && (
            <DoctorAppointments userDetails={userDetails} />
          )}
        </div>
        <div>
          {activeTab === "Past appointments" && (
            <DoctorPastAppointments userDetails={userDetails} />
          )}
        </div>
        <div>
          {activeTab === "Medical Records" && (
            <DoctorMedicalRecords userDetails={userDetails} />
          )}
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;
