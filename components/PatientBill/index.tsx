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
  IconButton,
} from "@chakra-ui/react";
import ReactPDF from "@react-pdf/renderer";
import { FaFileAlt } from "react-icons/fa"; // Use FaFileAlt for a document icon
import supabase from "@/utils/supabase";
import BillPdf from "./BillPdf";

// Define the component
const PatientViewBills: React.FC = () => {
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

  const [userDetails, setUserDetails] = useState<any>();

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

  const fetchBills = async () => {
    try {
      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .eq("patient_id", userDetails?.id);

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

  useEffect(() => {
    fetchBills();
  }, [userDetails]);

  const handleShowBill = (bill: any) => {
    setSelectedBill(bill);
    setFormData({
      dueDate: bill.due_date,
      items: bill.items,
    });
    onOpen();
  };

  return (
    <div className="w-full py-10 px-10">
      <div className="w-full flex justify-between items-center">
        <p className="pl-6 text-gray-800 font-semibold dark:text-gray-100">
          View Bills
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
                      aria-label="Show Bill"
                      icon={<FaFileAlt />}
                      onClick={() => handleShowBill(bill)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      {/* Chakra UI Modal for Show Bill */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bill Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl id="dueDate">
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="text"
                  value={formData.dueDate}
                  isReadOnly
                  variant="filled"
                />
              </FormControl>
              <FormControl id="items">
                <FormLabel>Items</FormLabel>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Item</Th>
                      <Th>Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {formData.items.map((item, index) => (
                      <Tr key={index}>
                        <Td>{item.item}</Td>
                        <Td>{item.amount}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                  <Tbody>
                    <Tr>
                      <Td className="font-semibold">Total</Td>
                      <Td className="font-semibold">
                        {formData.items.reduce(
                          (total, item) => total + item.amount,
                          0
                        )}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PatientViewBills;
