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
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  chakra,
  Textarea,
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import supabase from "@/utils/supabase";

// Define the component
const ManageBills: React.FC = () => {
  const [bills, setBills] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBill, setSelectedBill] = useState<any>({});
  const [formData, setFormData] = useState({
    dueDate: "",
    items: [{ item: "", amount: 0 }],
  });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const { data, error } = await supabase.from("bills").select("*");

      if (error) {
        console.error("Error fetching bills:", error.message);
        return;
      }

      if (data) {
        setBills(data);
      }
    } catch (error: any) {
      console.error("Error fetching bills:", error.message);
    }
  };

  const handleEditBill = (bill: any) => {
    setSelectedBill(bill);
    setFormData({
      dueDate: bill.due_date,
      items: bill.items,
    });
    onOpen();
  };

  const handleDeleteBill = async (billId: number) => {
    const { error } = await supabase.from("bills").delete().eq("id", billId);

    if (error) {
      console.error("Error deleting bill:", error.message);
    } else {
      fetchBills();
    }
  };

  const handleSubmit = async () => {
    try {
      // Update existing bill
      const { data, error } = await supabase
        .from("bills")
        .update(formData)
        .eq("id", selectedBill.id);

      if (error) {
        console.error("Error updating bill:", error.message);
      } else {
        fetchBills();
        onClose();
      }
    } catch (error: any) {
      console.error("Error submitting bill:", error.message);
    }
  };

  return (
    <div className="w-full py-10 px-10">
      <div className="w-full flex justify-between items-center">
        <p className="pl-6 text-gray-800 font-semibold dark:text-gray-100">
          Manage Bills
        </p>
      </div>
      <div className="rounded-lg shadow-md overflow-y-auto max-h-[85vh]">
        <Table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <Thead className="text-xs sticky text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <Tr>
              <Th>BILL ID</Th>
              <Th>Invoice Number</Th>
              <Th>Patient ID</Th>
              <Th>Doctor ID</Th>
              <Th>Due Date</Th>
              <Th>Total Amount</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bills.map((bill) => (
              <Tr
                key={bill.bill_id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <Td>{bill.bill_id}</Td>
                <Td>{bill.invoice_number}</Td>
                <Td>{bill.patient_id}</Td>
                <Td>{bill.doctor_id}</Td>
                <Td>{bill.due_date}</Td>
                <Td>{bill.amount}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      size="sm"
                      aria-label="Edit Bill"
                      icon={<FaEdit />}
                      onClick={() => handleEditBill(bill)}
                    />
                    <IconButton
                      size="sm"
                      aria-label="Delete Bill"
                      icon={<FaTrash />}
                      onClick={() => handleDeleteBill(bill.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      {/* Chakra UI Modal for Edit Bill */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Bill</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e: any) =>
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
                      onChange={(e: any) =>
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
                      onChange={(e: any) =>
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
                    <IconButton
                      aria-label="Remove Item"
                      icon={<FaTrash />}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          items: prev.items.filter((_, i) => i !== index),
                        }))
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
              Save Changes
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ManageBills;
