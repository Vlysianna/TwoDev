import { useState, useEffect } from "react";
import SidebarAsesi from "@/components/SideAsesi";
import paths from "@/routes/paths";
import { ListFilter, Search, LayoutDashboard, ListCheck } from "lucide-react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import api from "@/helper/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/helper/initial";
import { formatDate } from "@/helper/format-date";
import type { ScheduleCompleted } from "@/model/schedule-completed-model";

export default function AsessmentAktif() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [assessments, setAssessments] = useState<ScheduleCompleted[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<
    ScheduleCompleted[]
  >([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAssessments(assessments);
    } else {
      const filtered = assessments.filter(
        (assessment) =>
          assessment.detail.assessment.occupation.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          assessment.detail.assessment.occupation.scheme.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredAssessments(filtered);
    }
  }, [searchTerm, assessments]);

  useEffect(() => {
    // Simulasi pengambilan data dari API
    const fetchData = async () => {
      api
        .get("/schedules/completed")
        .then((response) => setAssessments(response.data.data))
        .then(() => {
          console.log(assessments);
        });
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredAssessments(assessments);
  }, [assessments]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md ">
        <SidebarAsesi />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0 md:ml-0">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <NavbarAsesi title="Riwayat" icon={<ListCheck size={25} />} />
        </div>

        <div className="p-6">
          <main>
            {/* Header dengan Search dan Filter */}
            <div className="mb-6 p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Selamat datang,</span>
                  <span className="font-semibold text-gray-900">
                    {user?.email?.split("@")[0] || "Asesi"}!
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-full md:w-80">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>

                  <button className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    <ListFilter className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Filter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Kartu Okupasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.map((assessment) => (
                <div
                  key={assessment.detail.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-shadow relative`}
                >
                  {/* Garis bawah */}
                  <div
                    className={`absolute bottom-0 left-0 w-full h-1 rounded-b-xl`}
                  />

                  {/* Header Kartu */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {assessment.detail.assessment.occupation.scheme.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {assessment.detail.assessment.occupation.name}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span
                          className={`${
                            assessment.status === "Competent"
                              ? "bg-green-300 text-green-800"
                              : "bg-red-300 text-red-800"
                          } text-xs px-3 py-1 rounded-full font-medium`}
                        >
                          {assessment.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tanggal */}
                  <div className="px-4 pt-3 pb-20">
                    <div className="flex flex-col items-center">
                      <div className="flex justify-between w-full text-sm text-gray-800 mb-2 font-medium">
                        <span>{formatDate(assessment.detail.start_date)}</span>
                        <span>{formatDate(assessment.detail.end_date)}</span>
                      </div>

                      <div className="relative w-full h-4 flex items-center">
                        <div className="absolute left-0 right-0 h-[2px] bg-black" />

                        <div className="w-4 h-4 bg-white border-2 border-black rounded-full z-2"></div>
                        <div className="flex-1"></div>
                        <div className="w-4 h-4 bg-white border-2 border-black rounded-full z-2"></div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 pb-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {getInitials(
                              assessment.detail.schedule_details.assessor
                                .full_name
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {
                              assessment.detail.schedule_details.assessor
                                .full_name
                            }
                          </p>
                          <p className="text-xs text-gray-500">Asesor</p>
                        </div>
                      </div>

                      {assessment.status !== "Competent" && (
                        <Link
                          to={"#"}
                          className="text-sm text-gray-500 hover:underline cursor-pointer"
                        >
                          Banding Asesmen
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
