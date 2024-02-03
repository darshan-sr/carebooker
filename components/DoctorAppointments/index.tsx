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

interface DoctorAppointmentsProps {
  userDetails: any;
}

const DoctorAppointments: React.FC<DoctorAppointmentsProps> = ({
  userDetails,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDataFetching, setIsDataFetching] = useState<boolean>(false);

  const fetchAppointments = async () => {
    try {
      setIsDataFetching(true);
      // Replace with the actual patient_id
      const doctorId = userDetails?.doctor_id;
      const { data, error } = await supabase
        .from("appointment")
        .select("*")
        .eq("doctor_id", doctorId)
        .gte("appointment_date", new Date().toISOString())
        .order("appointment_date", { ascending: true, nullsFirst: false });

      if (error) {
        console.error("Error fetching appointments:", error.message);
        setIsDataFetching(false);
      } else if (data) {
        console.log("Appointments:", data);
        setAppointments(data as Appointment[]);
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

  const handleUpdateAppointment = async (appointmentId: number) => {
    // Implement your logic to update the appointment
    console.log("Updating appointment with ID:", appointmentId);
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    // Implement your logic to delete the appointment
    // Are you sure you want to delete this appointment?
    if (confirm("Are you sure you want to cancel this appointment?")) {
      console.log("Deleting appointment with ID:", appointmentId);
      const { error } = await supabase
        .from("appointment")
        .update({ appointment_status: "cancelled" })
        .eq("appointment_id", appointmentId);
      fetchAppointments();
    }
  };

  const handleAcceptAppointment = async (appointmentId: number) => {
    // Implement your logic to accept the appointment
    console.log("Accepting appointment with ID:", appointmentId);
    if (confirm("Are you sure you want to accept this appointment?")) {
      const { error } = await supabase
        .from("appointment")
        .update({ appointment_status: "confirmed" })
        .eq("appointment_id", appointmentId);
      fetchAppointments();
      alert("Appointment accepted successfully!");
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
      <h2 className="text-md text-gray-700 font-bold m-4">
        Current Appointments
      </h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Patient ID
              </th>
              <th scope="col" className="px-6 py-3">
                Patient Name
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((appointment) => (
              <tr
                key={appointment.appointment_id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  CREBK0{appointment.patient_id}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {appointment.patient_name}
                </td>

                <td className="px-6 py-4 ">
                  <p
                    className={`p-1 rounded flex flex-row items-center justify-center px-4 ${
                      appointment.appointment_status === "confirmed"
                        ? "bg-green-100"
                        : appointment.appointment_status === "pending"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                    }`}
                  >
                    <span
                      className={`flex w-3 h-3 me-3 rounded-full ${
                        appointment.appointment_status === "confirmed"
                          ? "bg-green-500"
                          : appointment.appointment_status === "pending"
                          ? "bg-yellow-300"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {appointment.appointment_status}
                  </p>
                </td>
                <td className="px-6 py-4">{appointment.appointment_date}</td>
                <td className="px-6 py-4">
                  {formatTimeToAMPM(appointment.appointment_time)}
                </td>
                <td className="px-6 flex flex-row gap-4 py-4">
                  {appointment.appointment_status === "pending" && (
                    <>
                      <button
                        className="text-green-700 hover:text-white border border-green-500 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-1 mb-1 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-900"
                        onClick={() =>
                          handleAcceptAppointment(appointment.appointment_id)
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="text-red-700 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-1 mb-1 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                        onClick={() =>
                          handleCancelAppointment(appointment.appointment_id)
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {appointment.appointment_status === "confirmed" && (
                    <button
                      className="text-red-700 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-1 mb-1 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                      onClick={() =>
                        handleCancelAppointment(appointment.appointment_id)
                      }
                    >
                      Cancel
                    </button>
                  )}

                  {appointment.appointment_status === "cancelled" && (
                    <button
                      className="text-green-700 hover:text-white border border-green-500 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-1 mb-1 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-900"
                      onClick={() =>
                        handleAcceptAppointment(appointment.appointment_id)
                      }
                    >
                      Accept
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointments;
