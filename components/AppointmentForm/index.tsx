"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/utils/supabase";
import { Rate } from "antd";


interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
  unavailable_dates: string[];
  contact_no: string;
  email: string;
  shift: string;
}

const AppointmentForm: React.FC = () => {
  const [specialization, setSpecialization] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [step, setStep] = useState<number>(1);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [doctorRatings, setDoctorRatings] = useState<{ [key: number]: number }>({});


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

  useEffect(() => {
    const fetchDoctorRatings = async () => {
      try {
        const { data: allDoctorRatings, error } = await supabase
          .from("doctor_ratings")
          .select("doctor_id, stars");
    
        if (error) {
          console.error("Error fetching doctor ratings:", error.message);
          return;
        }
    
        const ratingsMap: { [key: number]: { sum: number; count: number } } = {};
    
        allDoctorRatings?.forEach((rating: any) => {
          if (!ratingsMap[rating.doctor_id]) {
            ratingsMap[rating.doctor_id] = { sum: 0, count: 0 };
          }
          ratingsMap[rating.doctor_id].sum += rating.stars;
          ratingsMap[rating.doctor_id].count++;
        });
    
        const averageRatings: { [key: number]: number } = {};
    
        Object.keys(ratingsMap).forEach((doctorId) => {
          const sum = ratingsMap[doctorId].sum;
          const count = ratingsMap[doctorId].count;
          averageRatings[doctorId] = sum / count;
        });
    
        setDoctorRatings(averageRatings);
      } catch (error: any) {
        console.error("Error fetching doctor ratings:", error.message);
      }
    };
    

    fetchDoctorRatings();
  }, []);


  const handleSpecializationChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedSpecialization = event.target.value;
    setSpecialization(selectedSpecialization);

    try {
      const { data: doctorsData, error } = await supabase
        .from("doctor")
        .select(
          "doctor_id, name, specialization, unavailable_dates, contact_no, email, shift"
        )
        .eq("specialization", selectedSpecialization);

      if (error) {
        console.error("Error fetching doctors:", error.message);
      } else {
        // Filter doctors based on selected date and time
        const availableDoctors = doctorsData.filter((doctor: Doctor) => {
          // Check if the selected date is not in the doctor's unavailable_dates
          return !doctor.unavailable_dates.includes(selectedDate);
        });

        setDoctors(availableDoctors);
      }
    } catch (error: any) {
      console.error("Error fetching doctors:", error.message);
    }
  };

  const clearState = () => {
    setSpecialization("");
    setSelectedDate("");
    setSelectedTime("");
    setDoctors([]);
    setSelectedDoctor(null);
    setStep(1);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event: any) => {
    setSelectedTime(event.target.value);
  };

  const handleDoctorSelection = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === 1) {
      // First step logic
      if (!specialization || !selectedDate || !selectedTime) {
        alert("Please fill all the fields.");
        return;
      }

      setStep(2);
      return;
    }

    // Second step logic
    console.log(selectedDoctor, selectedDate, selectedTime);

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      console.error("Please select a doctor, date, and time");
      return;
    }

    try {
      // Check if there are existing appointments for the selected doctor, date, and time
      const { data: existingAppointments, error: fetchError } = await supabase
        .from("appointment")
        .select("*")
        .eq("doctor_id", selectedDoctor.doctor_id)
        .eq("appointment_date", selectedDate)
        .eq("appointment_time", selectedTime);

      if (fetchError) {
        console.error(
          "Error fetching existing appointments:",
          fetchError.message
        );
        return;
      }

      if (existingAppointments && existingAppointments.length > 0) {
        // Show alert if there are existing appointments
        alert(
          "This slot for this doctor is not available. Please choose another slot or doctor."
        );
        return;
      }

      // Set the appointment status to 'Yet to be confirmed'
      const { data, error } = await supabase.from("appointment").upsert([
        {
          patient_id: userDetails.id,
          doctor_id: selectedDoctor.doctor_id,
          specialization: selectedDoctor.specialization,
          appointment_status: "pending",
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          doctor_name: selectedDoctor.name,
          patient_name: userDetails.name,
        },
      ]);

      if (error) {
        console.error("Error creating appointment:", error.message);
      } else {
        console.log("Appointment created successfully:", data);
        alert("Appointment created successfully");
        clearState();

        // Handle redirection or show success message
      }
    } catch (error: any) {
      console.error("Error creating appointment:", error.message);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    const startTime = new Date();
    startTime.setHours(9, 0, 0, 0); // Set start time to 9 AM

    const endTime = new Date();
    endTime.setHours(22, 0, 0, 0); // Set end time to 10 PM

    while (startTime <= endTime) {
      const hours = startTime.getHours();
      const minutes = startTime.getMinutes();
      const amPm = hours >= 12 ? "PM" : "AM";

      const timeString = `${hours % 12 || 12}:${String(minutes).padStart(
        2,
        "0"
      )} ${amPm}`;
      options.push(
        <option key={timeString} value={timeString}>
          {timeString}
        </option>
      );

      startTime.setMinutes(startTime.getMinutes() + 30); // Increment by 15 minutes
    }

    return options;
  };

  // ...

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mt-[5vh] mb-24 mx-auto border border-gray-200 p-4 rounded-lg"
      >
        <h4 className="block my-5 text-lg w-full text-center font-semibold  text-blue-600 dark:text-white ">
          Book Appointment
        </h4>
        {step === 1 && (
          <>
            <div className="mb-5">
              <label
                htmlFor="specialization"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Specialization:
              </label>
              <select
                id="specialization"
                value={specialization}
                onChange={handleSpecializationChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select Specialization</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
              </select>
            </div>
            <div className="mb-5">
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Date:
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="date"
                id="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="time"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Time:
              </label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="time"
                value={selectedTime}
                onChange={handleTimeChange}
              >
                {generateTimeOptions()}
              </select>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="p-4  ">
              <p className="text-lg font-bold mb-2">Select Doctor:</p>
              <div className="max-h-[45vh] overflow-auto ">
                {doctors.map((doctor, index) => (
                  <div
                    key={doctor.doctor_id}
                    className={`mb-4 p-4 border rounded-md ${
                      selectedDoctor === doctor ? "bg-blue-200" : "bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      id={`doctor${index}`}
                      name="selectedDoctor"
                      value={index}
                      onChange={() => handleDoctorSelection(doctor)}
                      className="mr-2"
                    />
                    <label htmlFor={`doctor${index}`} className="font-bold">
                      {doctor.name}
                    </label>
                    <p className="text-gray-600">
                      Contact Number: {doctor.contact_no}
                    </p>
                    <p className="text-gray-600">
                      Specialization: {doctor.specialization}
                    </p>

                    <p className="text-gray-600">Email: {doctor.email}</p>

                  {doctorRatings[doctor.doctor_id] ? (
                    <>
                    <Rate
                    defaultValue={doctorRatings[doctor.doctor_id]}
                    disabled
                    className="ant-rate-disabled ant-rate-star"
                    character={({ index }) => {
                      return doctorRatings[doctor.doctor_id] && index < doctorRatings[doctor.doctor_id]
                        ? "\u2605" // Full star
                        : "\u2606"; // Empty star
                    }}
                    style={{ color: "#fadb14" }} // Yellow color
                  />
                  
                    
                    </>
                
                  ) : <p className="text-gray-600" >no ratings</p>}
                    
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          {step === 2 && (
            <button
              className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              type="button"
              onClick={() => setStep(1)}
            >
              back
            </button>
          )}
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="submit"
          >
            {step === 1 ? "Next" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
