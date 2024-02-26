// PatientPastAppointments.tsx
"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/utils/supabase";
import { Modal, Rate } from "antd";

interface Appointment {
  appointment_id: number;
  doctor_name: string;
  specialization: string;
  appointment_status: string;
  appointment_date: string;
  appointment_time: string;
  doctor_id: number;
}

const PatientPastAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDataFetching, setIsDataFetching] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>();

  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      // Get the current user from Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if the user has an email
        const userEmail = user.email;

        if (userEmail) {
          // Query the 'Patient' table for the user's email
          const { data: DoctorData, error: DoctorError } = await supabase
            .from("patient")
            .select("*")
            .eq("email", userEmail);

          if (DoctorError) {
            console.error("Error fetching Doctor data:", DoctorError.message);
            return;
          }

          if (DoctorData && DoctorData.length > 0) {
            // If Doctor data is found, log it or do something with it
            console.log("Patient data:", DoctorData[0]);
            setUserDetails(DoctorData[0]);
            // You may want to set the Doctor data to the state or perform other actions
          } else {
            console.log("Patient data not found.");
            // Handle the case where no Doctor data is found for the user's email
          }
        }
      }
    };

    getUser();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsDataFetching(true);
      // Replace with the actual patient_id
      const patientId = userDetails?.id;
      const { data, error } = await supabase
        .from("appointment")
        .select("*")
        .eq("patient_id", patientId)
        .eq("appointment_status", "confirmed")
        .lte("appointment_date", new Date().toISOString()) // Get upcoming appointments
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
  }, [userDetails]);

  const showReviewModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setReviewModalVisible(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedAppointment || !userDetails) return;

    try {
      const { data, error } = await supabase.from("doctor_ratings").insert([
        {
          doctor_id: selectedAppointment.doctor_id,
          patient_id: userDetails.id,
          stars: reviewRating,
          review: reviewText,
        },
      ]);

      if (error) {
        console.error("Error inserting review:", error.message);
        return;
      }

      console.log("Review submitted successfully:", data);

      // Close modal and reset state
      setReviewModalVisible(false);
      setReviewRating(0);
      setReviewText("");
    } catch (error: any) {
      console.error("Error inserting review:", error.message);
    }
  };


  const handleUpdateAppointment = async (appointmentId: number) => {
    // Implement your logic to update the appointment
    console.log("Updating appointment with ID:", appointmentId);
  };

  const handleDeleteAppointment = async (appointmentId: number) => {
    // Implement your logic to delete the appointment
    // Are you sure you want to delete this appointment?
    if (confirm("Are you sure you want to delete this appointment?")) {
      console.log("Deleting appointment with ID:", appointmentId);
      const { error } = await supabase
        .from("appointment")
        .delete()
        .eq("appointment_id", appointmentId);
      fetchAppointments();
      alert("Appointment deleted successfully!");
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
        Past Appointments
      </h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Doctor
              </th>
              <th scope="col" className="px-6 py-3">
                Specialization
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
                  {appointment.doctor_name}
                </td>
                <td className="px-6 py-4">{appointment.specialization}</td>
             
                <td className="px-6 py-4">{appointment.appointment_date}</td>
                <td className="px-6 py-4">
                  {formatTimeToAMPM(appointment.appointment_time)}
                </td>

                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => showReviewModal(appointment)}
                  >
                    Review
                  </button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        title="Write a Review"
        visible={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        onOk={handleReviewSubmit}
      >
        {/* Rating */}
        <div className="mb-4">
          <span>Rating:</span>
          <Rate value={reviewRating} onChange={(value) => setReviewRating(value)} />
        </div>
        {/* Review Text */}
        <div className="mb-4">
          <span>Review:</span>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full h-24 border rounded-md"
          />
        </div>
      </Modal>
    </div>
  );
};

export default PatientPastAppointments;
