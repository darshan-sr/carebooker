// Import necessary dependencies
"use client";
import { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import supabase from "@/utils/supabase";

// Define the component
const ManageDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDoctor, setSelectedDoctor] = useState<any>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_no: "",
    specialization: "",
    shift: "day",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from("doctor")
        .select("*")
        .order("doctor_id", { ascending: true });

      if (error) {
        console.error("Error fetching doctors:", error.message);
        return;
      }

      if (data) {
        setDoctors(data);
      }
    } catch (error: any) {
      console.error("Error fetching doctors:", error.message);
    }
  };

  const handleAddDoctor = () => {
    setFormData({
      name: "",
      email: "",
      contact_no: "",
      specialization: "",
      shift: "day",
    });
    setSelectedDoctor({});
    onOpen();
  };

  const handleEditDoctor = (doctor: any) => {
    setFormData({
      name: doctor.name,
      email: doctor.email,
      contact_no: doctor.contact_no || "",
      specialization: doctor.specialization || "",
      shift: doctor.shift || "day",
    });
    setSelectedDoctor(doctor);
    onOpen();
  };

  const handleDeleteDoctor = async (doctorId: number) => {
    const { error } = await supabase
      .from("doctor")
      .delete()
      .eq("doctor_id", doctorId);

    if (error) {
      console.error("Error deleting doctor:", error.message);
    } else {
      fetchDoctors();
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedDoctor.doctor_id) {
        // Update existing doctor
        const { error } = await supabase
          .from("doctor")
          .update(formData)
          .eq("doctor_id", selectedDoctor.doctor_id);

        if (error) {
          console.error("Error updating doctor:", error.message);
        } else {
          fetchDoctors();
          onClose();
        }
      } else {
        // Add new doctor
        const { data, error } = await supabase.from("doctor").upsert([
          {
            ...formData,
          },
        ]);

        if (error) {
          console.error("Error adding doctor:", error.message);
        } else {
          fetchDoctors();
          onClose();
        }
      }
    } catch (error: any) {
      console.error("Error submitting doctor:", error.message);
    }
  };

  return (
    <div className="w-full py-10 px-5 ">
      <div className="w-full  flex justify-between items-center">
        <p className="pl-6 text-gray-800 font-semibold dark:text-gray-100">
          Manage Doctors
        </p>

        <button
          type="button"
          onClick={handleAddDoctor}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add New Doctor
        </button>
      </div>
      <div className="rounded-lg shadow-md overflow-y-auto max-h-[85vh]">
        <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs sticky text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                {" "}
                ID
              </th>
              <th scope="col" className="px-6 py-3 w-full">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Specialization
              </th>
              <th scope="col" className="px-6 py-3">
                Contact No
              </th>
              <th scope="col" className="px-6 py-3">
                Shift
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr
                key={doctor.doctor_id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td className="px-6 py-4">DOC0{doctor.doctor_id}</td>
                <td className="px-6 py-4">{doctor.name}</td>
                <td className="px-6 py-4">{doctor.email}</td>
                <td className="px-6 py-4">{doctor.specialization}</td>
                <td className="px-6 py-4">{doctor.contact_no || "-"}</td>
                <td className="px-6 py-4">{doctor.shift}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-row">
                    <button
                      type="button"
                      onClick={() => handleEditDoctor(doctor)}
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDoctor(doctor.doctor_id)}
                      className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-500 font-medium rounded-lg text-sm px-2 py-1 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-500 dark:focus:ring-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Chakra UI Modal for Add/Edit Doctor */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedDoctor.doctor_id ? "Edit Doctor" : "Add Doctor"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={formData.name}
                onChange={(e: any) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e: any) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Contact No</FormLabel>
              <Input
                type="text"
                value={formData.contact_no}
                onChange={(e: any) =>
                  setFormData({ ...formData, contact_no: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Specialization</FormLabel>
              <Input
                type="text"
                value={formData.specialization}
                onChange={(e: any) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Shift</FormLabel>
              <Select
                value={formData.shift}
                onChange={(e: any) =>
                  setFormData({ ...formData, shift: e.target.value })
                }
              >
                <option value="day">Day</option>
                <option value="evening">Evening</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ManageDoctors;
