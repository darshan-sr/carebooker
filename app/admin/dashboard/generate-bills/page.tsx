"use client";
// Import necessary dependencies
import { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  Stack,
  VStack,
  HStack,
} from "@chakra-ui/react";
import supabase from "@/utils/supabase";

interface formData {
  dueDate: string;
  items: { item: string; amount: number }[];
}

// Define the component
const GenerateBill: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAppointment, setSelectedAppointment] = useState<any>({});
  const [formData, setFormData] = useState<formData>({
    dueDate: "",
    items: [{ item: "", amount: 0 }],
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointment")
        .select("*")
        .eq("appointment_status", "confirmed")
        .order("appointment_id", { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error.message);
        return;
      }

      if (data) {
        setAppointments(data);
      }
    } catch (error: any) {
      console.error("Error fetching appointments:", error.message);
    }
  };

  const handleGenerateBill = (appointment: any) => {
    setSelectedAppointment(appointment);
    setFormData({
      dueDate: "",
      items: [{ item: "", amount: 0 }],
    });
    onOpen();
  };

  const handleSubmit = async () => {
    try {
      // Calculate total amount including tax
      const taxRate = 0.18;
      const totalAmount =
        formData.items.reduce((sum, item) => sum + item.amount, 0) +
        formData.items.reduce((sum, item) => sum + item.amount * taxRate, 0);

      // Create a bill entry in the 'bills' table
      const { data, error } = await supabase.from("bills").upsert([
        {
          appointment_id: selectedAppointment.appointment_id,
          patient_id: selectedAppointment.patient_id,
          doctor_id: selectedAppointment.doctor_id,
          date: new Date(),
          invoice_number: `INV${Date.now()}`,
          due_date: formData.dueDate,
          amount: totalAmount,
          items: formData.items,
          tax: taxRate,
        },
      ]);

      if (error) {
        console.error("Error generating bill:", error.message);
      } else {
        console.log("Bill generated successfully:", data);
        alert("Bill generated successfully!");
        fetchAppointments();

        onClose();
      }
    } catch (error: any) {
      console.error("Error generating bill:", error.message);
    }
  };

  return (
    <div className="w-full py-10 px-10">
      <div className="w-full  flex justify-between items-center">
        <p className="pl-6 text-gray-800 font-semibold dark:text-gray-100">
          Generate Bills
        </p>
      </div>
      <div className="rounded-lg shadow-md overflow-y-auto max-h-[85vh]">
        <Table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <Thead className="text-xs sticky text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <Tr>
              <Th>ID</Th>
              <Th>Patient Name</Th>
              <Th>Doctor Name</Th>
              <Th>Specialization</Th>
              <Th>Appointment Status</Th>
              <Th>Appointment Date</Th>
              <Th>Appointment Time</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {appointments.map((appointment) => (
              <Tr
                key={appointment.appointment_id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <Td>{appointment.appointment_id}</Td>
                <Td>{appointment.patient_name}</Td>
                <Td>{appointment.doctor_name}</Td>
                <Td>{appointment.specialization}</Td>
                <Td>{appointment.appointment_status}</Td>
                <Td>{appointment.appointment_date}</Td>
                <Td>{appointment.appointment_time}</Td>
                <Td>
                  <Stack direction="row">
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={() => handleGenerateBill(appointment)}
                    >
                      Generate Bill
                    </Button>
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      {/* Chakra UI Modal for Add/Edit Bill */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate Bill</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Items</FormLabel>
              <VStack spacing={4}>
                {formData.items.map((item, index) => (
                  <HStack key={index}>
                    <Input
                      type="text"
                      placeholder="Item"
                      value={item.item}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev) => {
                          const updatedItems = [...prev.items];
                          updatedItems[index] = {
                            ...updatedItems[index],
                            item: e.target.value,
                          };
                          return { ...prev, items: updatedItems };
                        })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev) => {
                          const updatedItems = [...prev.items];
                          updatedItems[index] = {
                            ...updatedItems[index],
                            amount: +e.target.value,
                          };
                          return { ...prev, items: updatedItems };
                        })
                      }
                    />
                  </HStack>
                ))}
                <Button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      items: [...prev.items, { item: "", amount: 0 }],
                    }))
                  }
                >
                  Add Item
                </Button>
              </VStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              Generate Bill
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GenerateBill;
