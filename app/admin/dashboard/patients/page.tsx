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
} from "@chakra-ui/react";
import supabase from "@/utils/supabase";

// Define the component
const ManagePatients = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPatient, setSelectedPatient] = useState<any>({});
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    address: "",
    contact_number: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patient")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching patients:", error.message);
        return;
      }

      if (data) {
        setPatients(data);
      }
    } catch (error: any) {
      console.error("Error fetching patients:", error.message);
    }
  };

  const handleAddPatient = () => {
    setFormData({
      name: "",
      date_of_birth: "",
      address: "",
      contact_number: "",
      email: "",
      password: "",
    });
    setSelectedPatient({});
    onOpen();
  };

  const handleEditPatient = (patient: any) => {
    setFormData({
      name: patient.name || "",
      date_of_birth: patient.date_of_birth || "",
      address: patient.address || "",
      contact_number: patient.contact_number || "",
      email: patient.email || "",
      password: patient.password || "",
    });
    setSelectedPatient(patient);
    onOpen();
  };

  const handleDeletePatient = async (patientId: number) => {
    const { error } = await supabase
      .from("patient")
      .delete()
      .eq("id", patientId);

    if (error) {
      console.error("Error deleting patient:", error.message);
    } else {
      fetchPatients();
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedPatient.id) {
        // Update existing patient
        const { error } = await supabase
          .from("patient")
          .update(formData)
          .eq("id", selectedPatient.id);

        if (error) {
          console.error("Error updating patient:", error.message);
        } else {
          fetchPatients();
          onClose();
        }
      } else {
        // Add new patient
        const { data, error } = await supabase.from("patient").upsert([
          {
            ...formData,
          },
        ]);

        const { data: patientSignUp, error: errorSignUp } =
          await supabase.auth.signUp({
            email: formData.email,
            password: "123456",
          });

        if (error) {
          console.error("Error adding patient:", error.message);
        } else {
          fetchPatients();
          alert("Patient added successfully with default password of 123456");
          onClose();
        }
      }
    } catch (error: any) {
      console.error("Error submitting patient:", error.message);
    }
  };

  return (
    <div className="w-full py-10 px-5">
      <div className="w-full  flex justify-between items-center">
        <p className="pl-6 text-gray-800 font-semibold dark:text-gray-100">
          Manage Patients
        </p>
        <button
          type="button"
          onClick={handleAddPatient}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add New Patient
        </button>
      </div>
      <div className="rounded-lg shadow-md overflow-y-auto max-h-[85vh]">
        <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs sticky text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3 ">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Contact Number
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Date of Birth
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td className="px-6 py-4">PAT0{patient.id}</td>
                <td className="px-6 py-4">{patient.name || "-"}</td>
                <td className="px-6 py-4">{patient.email || "-"}</td>
                <td className="px-6 py-4">{patient.contact_number || "-"}</td>
                <td className="px-6 py-4">{patient.address || "-"}</td>
                <td className="px-6 py-4">{patient.date_of_birth || "-"}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-row">
                    <button
                      type="button"
                      onClick={() => handleEditPatient(patient)}
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePatient(patient.id)}
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
      {/* Chakra UI Modal for Add/Edit Patient */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedPatient.id ? "Edit Patient" : "Add Patient"}
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
              <FormLabel>Contact Number</FormLabel>
              <Input
                type="text"
                value={formData.contact_number}
                onChange={(e: any) =>
                  setFormData({ ...formData, contact_number: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                value={formData.address}
                onChange={(e: any) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                value={formData.date_of_birth}
                onChange={(e: any) =>
                  setFormData({ ...formData, date_of_birth: e.target.value })
                }
              />
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

export default ManagePatients;
