// CurrentAppointments.tsx
"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/utils/supabase";

interface Appointment {
  appointment_id: number;
  doctor_name: string;
  specialization: string;
  appointment_status: string;
  appointment_date: string;
  appointment_time: string;
  patient_id: number;
  patient_name: string;
}

interface DoctorMedicalRecordsProps {
  userDetails: any;
}

const DoctorMedicalRecords: React.FC<DoctorMedicalRecordsProps> = ({
  userDetails,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>();
  const [isDataFetching, setIsDataFetching] = useState<boolean>(false);

  const fetchAppointments = async () => {
    try {
      setIsDataFetching(true);
      // Replace with the actual patient_id
      const doctorId = userDetails?.doctor_id;
      const { data, error } = await supabase
        .from("medical_records")
        .select("*")
        .eq("doctor_id", doctorId)
        .order("date", { ascending: true, nullsFirst: false });

      if (error) {
        console.error("Error fetching appointments:", error.message);
        setIsDataFetching(false);
      } else if (data) {
        console.log("Appointments:", data);

        setMedicalRecords(data);
        setIsDataFetching(false);
      }
    } catch (error: any) {
      console.error("Error fetching appointments:", error.message);
      setIsDataFetching(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDeleteMedicalRecord = async (recordId: number) => {
    // Implement your logic to delete the appointment
    // Are you sure you want to delete this appointment?
    if (confirm("Are you sure you want to delete this medical record?")) {
      console.log("Deleting appointment with ID:", recordId);
      const { error } = await supabase
        .from("medical_records")
        .delete()
        .eq("id", recordId);
      fetchAppointments();
    }
  };

  const formatTimeToAMPM = (time24hr: string): string => {
    const [hours, minutes] = time24hr.split(":");
    const formattedHours = parseInt(hours, 10) % 12 || 12;
    const ampm = parseInt(hours, 10) >= 12 ? "PM" : "AM";
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="w-full flex items-center justify-center flex-col">
      <h2 className="text-md text-gray-700 font-bold m-4">Medical Records</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Appointment ID
              </th>
              <th scope="col" className="px-6 py-3">
                Patient Name
              </th>

              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Prescription
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {medicalRecords?.map((records) => (
              <tr
                key={records.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {records.appointment_id}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {records.patient_name}
                </td>
                <td className="px-6 py-4">{records.date}</td>
                <td className="px-6 py-4">{records.title}</td>
                <td className="px-6 py-4">{records.prescription}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteMedicalRecord(records.id)}
                    className="text-red-700 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-1 mb-1 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorMedicalRecords;
