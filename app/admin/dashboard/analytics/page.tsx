"use client";

import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import supabase from "@/utils/supabase";

const DashboardPage: React.FC = () => {
  const [appointmentsData, setAppointmentsData] = useState<
    {
      doctor: string;
      appointments: number;
    }[]
  >([]);
  const [specializationData, setSpecializationData] = useState<
    {
      specialization: string;
      count: number;
    }[]
  >([]);
  const [doctorShiftData, setDoctorShiftData] = useState<
    {
      shift: string;
      count: number;
    }[]
  >([]);
  const [appointmentsPerDayData, setAppointmentsPerDayData] = useState<
    {
      date: string;
      appointments: number;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch appointments data
      const { data: appointments, error: appointmentsError } = await supabase
        .from("appointment")
        .select("*");

      if (appointmentsError) {
        console.error(
          "Error fetching appointments data:",
          appointmentsError.message
        );
        return;
      }

      // Process appointments data for chart
      const appointmentsChartData = appointments.map((appointment) => ({
        doctor: appointment.doctor_name,
        appointments: 1, // Count each appointment as 1 for simplicity
      }));

      setAppointmentsData(appointmentsChartData);

      // Fetch specialization data
      const { data: specializations, error: specializationsError } =
        await supabase.from("doctor").select("specialization");

      if (specializationsError) {
        console.error(
          "Error fetching specialization data:",
          specializationsError.message
        );
        return;
      }

      // Process specialization data for chart
      const specializationCounts = specializations.reduce<{
        [key: string]: number;
      }>((acc, specialization) => {
        acc[specialization.specialization] =
          (acc[specialization.specialization] || 0) + 1;
        return acc;
      }, {});

      const specializationChartData = Object.entries(specializationCounts).map(
        ([specialization, count]) => ({
          specialization,
          count,
        })
      );

      setSpecializationData(specializationChartData);

      // Fetch doctor shift data
      const { data: doctorShifts, error: doctorShiftsError } = await supabase
        .from("doctor")
        .select("shift");

      if (doctorShiftsError) {
        console.error(
          "Error fetching doctor shift data:",
          doctorShiftsError.message
        );
        return;
      }

      // Process doctor shift data for chart
      const doctorShiftCounts = doctorShifts.reduce<{ [key: string]: number }>(
        (acc, doctorShift) => {
          acc[doctorShift.shift] = (acc[doctorShift.shift] || 0) + 1;
          return acc;
        },
        {}
      );

      const doctorShiftChartData = Object.entries(doctorShiftCounts).map(
        ([shift, count]) => ({
          shift,
          count,
        })
      );

      setDoctorShiftData(doctorShiftChartData);

      // Process appointments per day data for chart
      const appointmentsPerDayChartData = appointments.reduce<{
        [key: string]: number;
      }>((acc, appointment) => {
        const dateKey = appointment.appointment_date;
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
      }, {});

      setAppointmentsPerDayData(
        Object.entries(appointmentsPerDayChartData).map(
          ([date, appointments]) => ({
            date,
            appointments,
          })
        )
      );
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow chart-container">
          <h2 className="text-xl font-bold mb-4">Appointments per Doctor</h2>
          <Plot
            data={[
              {
                x: appointmentsData.map((data) => data.doctor),
                y: appointmentsData.map((data) => data.appointments),
                type: "bar",
                marker: { color: "rgba(54, 162, 235, 0.5)" },
                line: { color: "rgba(54, 162, 235, 1)" },
              },
            ]}
            layout={{ title: "Appointments per Doctor" }}
            config={{ responsive: true }}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow chart-container">
          <h2 className="text-xl font-bold mb-4">
            Appointments per Specialization
          </h2>
          <Plot
            data={[
              {
                labels: specializationData.map((data) => data.specialization),
                values: specializationData.map((data) => data.count),
                type: "pie",
                marker: {
                  colors: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 205, 86, 0.5)",
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(153, 102, 255, 0.5)",
                  ],
                },
              },
            ]}
            layout={{ title: "Appointments per Specialization" }}
            config={{ responsive: true }}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow chart-container">
          <h2 className="text-xl font-bold mb-4">
            Appointments per Doctor Shift
          </h2>
          <Plot
            data={[
              {
                labels: doctorShiftData.map((data) => data.shift),
                values: doctorShiftData.map((data) => data.count),
                type: "pie",
                marker: {
                  colors: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                  ],
                },
              },
            ]}
            layout={{ title: "Appointments per Doctor Shift" }}
            config={{ responsive: true }}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow chart-container">
          <h2 className="text-xl font-bold mb-4">Appointments per Day</h2>
          <Plot
            data={[
              {
                x: appointmentsPerDayData.map((data) => data.date),
                y: appointmentsPerDayData.map((data) => data.appointments),
                type: "bar",
                marker: { color: "rgba(255, 159, 64, 0.5)" },
                line: { color: "rgba(255, 159, 64, 1)" },
              },
            ]}
            layout={{ title: "Appointments per Day" }}
            config={{ responsive: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
