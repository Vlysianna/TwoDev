import React from "react";
import { useNavigate } from "react-router-dom";

interface Scheme {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Assessor {
  id: number;
  full_name: string;
  scheme: Scheme;
  address: string;
  phone_no: string;
  birth_date: string;
}

const assessorData: Assessor = {
  id: 1,
  full_name: "Assessor Pertama",
  scheme: {
    id: 1,
    code: "RPL",
    name: "Rekayasa Perangkat Lunak",
    created_at: "2025-08-25T13:26:05.372Z",
    updated_at: "2025-08-25T13:26:05.372Z",
  },
  address: "Jalan Assessor No. 456",
  phone_no: "082345678901",
  birth_date: "1985-05-15T00:00:00.000Z",
};

const AssessorCertificate: React.FC = () => {
    const navigate = useNavigate();
  const birthDate = new Date(assessorData.birth_date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-6 text-center">
         {/* Tombol Back */}
        <div className="flex justify-start mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" 
                 fill="none" 
                 viewBox="0 0 24 24" 
                 strokeWidth={2} 
                 stroke="currentColor" 
                 className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{assessorData.full_name.toUpperCase()}</h1>     

        <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">          
          <p><b>Scheme:</b> {assessorData.scheme.name} ({assessorData.scheme.code})</p>
          <p><b>Address:</b> {assessorData.address}</p>
          <p><b>Phone:</b> {assessorData.phone_no}</p>
          <p><b>Birth Date:</b> {birthDate}</p>
        </div>
        
      </div>

      <footer className="mt-4 text-gray-500 text-sm">
        © 2025 TWODEV - All rights reserved.
      </footer>
    </div>
  );
};

export default AssessorCertificate;
