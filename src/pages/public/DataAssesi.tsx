import React from "react";
import { useNavigate } from "react-router-dom";

interface Job {
  id: number;
  assessee_id: number;
  institution_name: string;
  address: string;
  postal_code: string;
  position: string;
  phone_no: string;
  job_email: string;
  created_at: string;
  updated_at: string;
}

interface Assessee {
  id: number;
  full_name: string;
  identity_number: string;
  birth_date: string;
  birth_location: string;
  gender: string;
  nationality: string;
  phone_no: string;
  house_phone_no: string;
  office_phone_no: string;
  address: string;
  postal_code: string;
  educational_qualifications: string;
  jobs: Job[];
}

const assesseeData: Assessee = {
  id: 1,
  full_name: "Asesi Pertama",
  identity_number: "1234567890",
  birth_date: "1990-03-10T00:00:00.000Z",
  birth_location: "Jakarta",
  gender: "male",
  nationality: "Indonesia",
  phone_no: "084567890123",
  house_phone_no: "",
  office_phone_no: "",
  address: "Jalan Asesi No. 101",
  postal_code: "",
  educational_qualifications: "Sarjana",
  jobs: [
    {
      id: 1,
      assessee_id: 1,
      institution_name: "Perusahaan Teknologi Inc.",
      address: "Gedung Perkantoran Tower 200",
      postal_code: "12345",
      position: "Pengembang Software",
      phone_no: "0211234567",
      job_email: "asesi1@perusahaan.com",
      created_at: "2025-08-25T13:26:05.409Z",
      updated_at: "2025-08-25T13:26:05.409Z",
    },
  ],
};

const AssesseeCertificate: React.FC = () => {
  const navigate = useNavigate();
  const birthDate = new Date(assesseeData.birth_date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const job = assesseeData.jobs[0];

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

        {/* Ikon Centang */}
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

        {/* Nama */}
        <h1 className="text-2xl font-bold mb-2">{assesseeData.full_name.toUpperCase()}</h1>

        {/* Data Pribadi */}
        <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
          <p><b>Nomor Identitas:</b> {assesseeData.identity_number}</p>
          <p><b>Tempat, Tanggal Lahir:</b> {assesseeData.birth_location}, {birthDate}</p>
          <p><b>Jenis Kelamin:</b> {assesseeData.gender === "male" ? "Laki-laki" : "Perempuan"}</p>
          <p><b>Kewarganegaraan:</b> {assesseeData.nationality}</p>
          <p><b>Alamat:</b> {assesseeData.address}</p>
          <p><b>No. HP:</b> {assesseeData.phone_no}</p>
          <p><b>Pendidikan:</b> {assesseeData.educational_qualifications}</p>
        </div>

        {/* Data Pekerjaan */}
        {job && (
          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 mt-4">
            <h2 className="text-lg font-semibold">Pekerjaan</h2>
            <p><b>Institusi:</b> {job.institution_name}</p>
            <p><b>Jabatan:</b> {job.position}</p>
            <p><b>Alamat Kantor:</b> {job.address}</p>
            <p><b>Kode Pos:</b> {job.postal_code}</p>
            <p><b>Telepon Kantor:</b> {job.phone_no}</p>
            <p><b>Email Kantor:</b> {job.job_email}</p>
          </div>
        )}
      </div>

      <footer className="mt-4 text-gray-500 text-sm">
        © 2025 TWODEV - All rights reserved.
      </footer>
    </div>
  );
};

export default AssesseeCertificate;
