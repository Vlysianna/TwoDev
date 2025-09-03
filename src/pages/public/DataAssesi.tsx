import api from "@/helper/axios";
import { hashids } from "@/lib/hashids";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronLeft, 
  FileCheck2, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard,
  Globe,
  GraduationCap,
  Building2,
  Mail,
  Shield 
} from "lucide-react";

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

const AssesseeCertificate: React.FC = () => {
  const navigate = useNavigate();
  const { encodedId } = useParams<{ encodedId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assesseeData, setAssesseeData] = useState<Assessee | null>(null);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (encodedId) {
      fetchAssessorData();
    }
  }, [encodedId]);

  const fetchAssessorData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Decode encodedId untuk mendapatkan original ID
      const decodedIds = hashids.decode(encodedId!);
      if (decodedIds.length === 0) {
        setError("Invalid ID");
        return;
      }

      const originalId = decodedIds[0];
      const resp = await api.get(`/public/assessee/${originalId}`);

      if (!resp.data.success) {
        setError("Failed to fetch assessee data");
        return;
      }

      const data = resp.data.data;
      setAssesseeData(data);

      // Format tanggal lahir
      const birthDate = new Date(
        data.birth_date.split("T")[0]
      ).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      setFormattedDate(birthDate);
    } catch (err) {
      console.error("Failed to fetch assessee data:", err);
      setError("Failed to fetch assessee data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E77D35]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#E77D35] text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!assesseeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data found</p>
        </div>
      </div>
    );
  }

  const job = assesseeData.jobs[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        {/* Header dengan Navbar Style */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-600 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                <FileCheck2 className="text-[#E77D35]" size={20} />
                <h1 className="text-lg font-semibold text-gray-800">
                  Assessee Certificate
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-7">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Certificate Header */}
            <div className="bg-gradient-to-r from-[#E77D35] to-orange-600 p-6 rounded-t-lg">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">INFORMASI ASESI</h2>
                <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
              </div>
            </div>

            <div className="p-6">
              {/* Assessee Name Section */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  {assesseeData.full_name.toUpperCase()}
                </h3>
                <div className="w-32 h-1 bg-[#E77D35] mx-auto rounded-full"></div>
              </div>

              {/* Main Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Left Column - Personal Information */}
                <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#E77D35] rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Personal Information
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Identity Number</p>
                        <p className="text-gray-800 font-mono font-medium">{assesseeData.identity_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Birth Place & Date</p>
                        <p className="text-gray-800 font-medium">{assesseeData.birth_location}, {formattedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="text-gray-800 font-medium">
                          {assesseeData.gender === "male" ? "Laki-laki" : "Perempuan"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Nationality</p>
                        <p className="text-gray-800 font-medium">{assesseeData.nationality}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Education & Contact */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Education & Contact
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Education</p>
                        <p className="text-gray-800 font-medium">{assesseeData.educational_qualifications}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="text-gray-800 font-mono">{assesseeData.phone_no}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="text-gray-800">{assesseeData.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Information - Full Width */}
              {job && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Employment Information
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Institution</p>
                          <p className="text-gray-800 font-medium">{job.institution_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Position</p>
                          <p className="text-gray-800 font-medium">{job.position}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Office Address</p>
                          <p className="text-gray-800">{job.address}</p>
                          <p className="text-gray-600 text-sm">Postal Code: {job.postal_code}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Office Phone</p>
                          <p className="text-gray-800 font-mono">{job.phone_no}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Office Email</p>
                          <p className="text-gray-800">{job.job_email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Status */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-lg border border-green-200">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Verified Information</span>
                </div>
              </div>

              {/* Certificate Footer Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="text-center text-sm text-gray-500 space-y-2">
                  <p>This information is digitally verified and authenticated</p>
                  <p>© 2025 TWODEV - All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssesseeCertificate;