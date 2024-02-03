// MedicalRecordsModal.tsx
"use client";

import React, { useState } from "react";

interface MedicalRecordsModalProps {
  visible: boolean;
  appointment: any;
  onClose: () => void;
  onAddMedicalRecord: (
    title: string,
    prescription: string,
    appointment: any
  ) => void;
}

const MedicalRecordsModal: React.FC<MedicalRecordsModalProps> = ({
  visible,
  onClose,
  appointment,
  onAddMedicalRecord,
}) => {
  const [title, setTitle] = useState<string>("");
  const [prescription, setPrescription] = useState<string>("");

  const handleAddMedicalRecord = () => {
    // Validate input fields if needed

    // Call the parent component function to add medical record
    onAddMedicalRecord(title, prescription, appointment);

    // Clear the input fields and close the modal
    setTitle("");
    setPrescription("");
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 overflow-y-auto ${
        visible ? "visible" : "hidden"
      }`}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        {/* Modal panel */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
        >
          {/* Modal content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Add Medical Records
                </h3>
                <div className="mt-2">
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500 block w-full shadow-sm sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="prescription"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Prescription
                    </label>
                    <textarea
                      id="prescription"
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500 block w-full shadow-sm sm:text-sm"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleAddMedicalRecord}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-gray-50 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Add Record
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsModal;
