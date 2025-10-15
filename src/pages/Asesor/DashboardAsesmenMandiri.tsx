import {
  Search,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  SquareCheck,
  CheckCircle,
  SquareX,
  Loader,
  Info,
} from "lucide-react";
import SidebarAsesor from "@/components/SideAsesor";
import NavAsesor from "@/components/NavAsesor";
import { useEffect, useState, useRef, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/helper/axios";
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import InputScoreModal from "@/components/InputScoreModal";
import useToast from "@/components/ui/useToast";
import { set } from "react-hook-form";

interface AssesseeData {
  result_id: number;
  assessment_id: number;
  assessee_id: number;
  assessee_name: string;
  status: "Belum Tuntas" | "Menunggu Asesi" | "Tuntas";
}

interface TabResponse {
  assessment_id: number;
  assessment_code: string;
  tabs: Tab[];
}

interface Tab {
  name: string;
  status: "Belum Tuntas" | "Menunggu Asesi" | "Tuntas" | "Butuh Persetujuan";
}

export default function DashboardAsesmenMandiri() {
  const { user } = useAuth();
  const { id_assessment, id_asesor } = useAssessmentParams();
  const navigate = useNavigate();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [isModalPenilaianOpen, setModalPenilaianOpen] = useState(false);
  const [savingPenilaian, setSavingPenilaian] = useState(false);
  const [selectedAssessee, setSelectedAssessee] = useState<AssesseeData | null>(
    null
  );

  const toast = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tabData, setTabData] = useState<TabResponse | null>();
  const [selectedTab, setSelectedTab] = useState<string>(() => {
    const savedTab = localStorage.getItem(`selectedTab-${id_assessment}`);
    return savedTab || "apl-02";
  });
  const [assesseeData, setAssesseeData] = useState<AssesseeData[]>([]);
  const [filteredAssesseeData, setFilteredAssesseeData] = useState<
    AssesseeData[]
  >([]);
  const [showStatusInfo, setShowStatusInfo] = useState(false);

  useEffect(() => {
    localStorage.setItem(`selectedTab-${id_assessment}`, selectedTab);
  }, [selectedTab, id_assessment]);

  useEffect(() => {
    fetchAssesseeData(selectedTab.toLowerCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  useEffect(() => {
    setFilteredAssesseeData(assesseeData);
  }, [assesseeData]);

  useEffect(() => {
    setFilteredAssesseeData(
      assesseeData.filter((assessee) => {
        return assessee.assessee_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, assesseeData]);

  useEffect(() => {
    fetchTabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchTabs = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/assessments/navigation/assessor/${id_assessment}`
      );
      if (response.data.success) {
        setTabData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch tabs:", error);
      setError("Gagal memuat data tab");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssesseeData = async (tab: string) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/dashboard/assessor/${id_asesor}/${id_assessment}/${tab}`
      );
      if (response.data.success) {
        // console.log(response.data.data);
        setAssesseeData(
          response.data.data.sort((a: AssesseeData, b: AssesseeData) => {
            const order = {
              "Belum Tuntas": 0,
              "Menunggu Asesi": 1,
              Tuntas: 2,
            };

            const statusDiff = order[a.status] - order[b.status];
            if (statusDiff !== 0) return statusDiff;

            const nameA = a.assessee_name.toUpperCase();
            const nameB = b.assessee_name.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          })
        );
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch assessee data:", error);
      setError("Gagal memuat data asesi");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScore = async (score: number, result_id: number) => {
    try {
      setSavingPenilaian(true);
      const response = await api.put(
        `/assessments/result/input-score/${result_id}`,
        {
          score: score,
        }
      );

      if (response.data.success) {
        toast.show({
          title: "Penilaian berhasil disimpan",
          type: "success",
        });
        setSavingPenilaian(false);
        setModalPenilaianOpen(false);
      } else {
        toast.show({
          title: "Penilaian gagal disimpan " + response.data.message,
          type: "error",
        });
        setSavingPenilaian(false);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.show({
        title: `Penilaian gagal disimpan (${error.data.data.message})`,
        type: "error",
      });
      setSavingPenilaian(false);
    } finally {
      setSavingPenilaian(false);
    }
  };

  useEffect(() => {
    const checkScroll = () => {
      if (tabsContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          tabsContainerRef.current;
        setShowLeftScroll(scrollLeft > 0);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    if (tabsContainerRef.current) {
      tabsContainerRef.current.addEventListener("scroll", checkScroll);
      checkScroll();
    }

    return () => {
      if (tabsContainerRef.current) {
        tabsContainerRef.current.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      tabsContainerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getActionText = () => {
    switch (selectedTab.toLowerCase()) {
      case "apl-02":
        return "Cek APL-02 >";
      case "ia-01":
        return "Cek IA-01 >";
      case "ia-02":
        return "Cek IA-02 >";
      case "ia-03":
        return "Cek IA-03 >";
      case "ia-05":
        return "Cek IA-05 >";
      case "ia-07":
        return "Cek IA-07 >";
      case "ak-01":
        return "Cek AK-01 >";
      case "ak-02":
        return "Cek AK-02 >";
      case "ak-03":
        return "Cek AK-03 >";
      case "ak-05":
        return "Cek AK-05 >";
      case "penilaian":
        return "Nilai Asesi";
      default:
        return "Cek >";
    }
  };

  const handleActionClick = (assesseeId: number) => {
    switch (selectedTab.toLowerCase()) {
      case "apl-02":
        navigate(paths.asesor.assessment.cekApl02(id_assessment, assesseeId));
        break;
      case "ia-01":
        navigate(
          paths.asesor.assessment.ia01(id_assessment, String(assesseeId))
        );
        break;
      case "ia-02":
        navigate(paths.asesor.assessment.ia02(id_assessment, assesseeId));
        break;
      case "ia-03":
        navigate(paths.asesor.assessment.ia03(id_assessment, assesseeId));
        break;
      case "ia-05":
        navigate(paths.asesor.assessment.ia05(id_assessment, assesseeId));
        break;
      case "ak-01":
        navigate(paths.asesor.assessment.ak01(id_assessment, assesseeId));
        break;
      case "ak-02":
        navigate(paths.asesor.assessment.ak02(id_assessment, assesseeId));
        break;
      case "ak-03":
        navigate(paths.asesor.assessment.ak03(id_assessment, assesseeId));
        break;
      case "ak-05":
        navigate(paths.asesor.assessment.ak05(id_assessment, assesseeId));
        break;
      case "penilaian":
        setModalPenilaianOpen(true);
        break;
    }
  };

  const statusClasses: Record<string, string> = {
    "Belum Tuntas": "text-red-500",
    "Menunggu Asesi": "text-blue-500",
    Tuntas: "text-green-500",
    "Butuh Persetujuan": "text-yellow-500",
  };

  const badgeClasses: Record<string, string> = {
    "Belum Tuntas": "bg-red-100",
    "Menunggu Asesi": "bg-blue-100",
    Tuntas: "bg-green-100",
    "Butuh Persetujuan": "bg-yellow-100",
  };

  const statusIcons: Record<string, JSX.Element> = {
    "Belum Tuntas": <SquareX size={14} />,
    "Menunggu Asesi": <Loader size={14} />,
    Tuntas: <CheckCircle size={14} />,
    "Butuh Persetujuan": <SquareCheck size={14} />,
  };

  // Keterangan untuk setiap status
  const statusDescriptions = {
    Tuntas: {
      description: "Formulir telah lengkap dan disetujui",
      color: "bg-green-500",
      textColor: "text-green-700",
    },
    "Menunggu Asesi": {
      description: "Menunggu respons atau tindakan dari asesi",
      color: "bg-blue-500",
      textColor: "text-blue-700",
    },
    "Belum Tuntas": {
      description: "Formulir belum dikerjakan oleh Anda (Asesor)",
      color: "bg-red-500",
      textColor: "text-red-700",
    },
    "Butuh Persetujuan": {
      description: "Menunggu persetujuan dari Anda (Asesor)",
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md flex-shrink-0">
        <SidebarAsesor />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <NavAsesor
            title="Asesmen Mandiri"
            icon={<LayoutDashboard size={25} />}
          />
        </div>

        {/* Breadcrumb + Content */}
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-4">
            <Link to="/asesor" className="hover:underline">
              Asesor
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Asesmen Mandiri</span>
          </div>

          {/* Keterangan Status */}
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-700 me-2">
                Keterangan Status Formulir
              </h3>
              <button
                onClick={() => setShowStatusInfo(!showStatusInfo)}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <Info size={16} />
                <span className="ml-1 text-xs sm:text-md">
                  Lihat detail status
                </span>
              </button>
            </div>

            {showStatusInfo ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                {Object.entries(statusDescriptions).map(([status, info]) => (
                  <div
                    key={status}
                    className="flex items-start space-x-2 p-2 bg-gray-50 rounded-md"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${info.color}`}
                    ></div>
                    <div>
                      <span className={`text-sm font-medium ${info.textColor}`}>
                        {status}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {Object.entries(statusDescriptions).map(([status, info]) => (
                  <div key={status} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${info.color}`}></div>
                    <span className={`text-xs font-medium ${info.textColor}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tab Buttons dengan Scroll Horizontal */}
          <div className="relative mb-6">
            {/* Scroll buttons */}
            {showLeftScroll && (
              <button
                onClick={() => scrollTabs("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {showRightScroll && (
              <button
                onClick={() => scrollTabs("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Container tab dengan scroll horizontal */}
            <div
              ref={tabsContainerRef}
              className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {tabData &&
                tabData.tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setSelectedTab(tab.name)}
                    className={`flex-shrink-0 px-3 py-2 cursor-pointer rounded-md border-b-2 transition-all duration-200
    ${
      selectedTab.toLowerCase() === tab.name.toLowerCase()
        ? "border-orange-800 bg-[#E77D35] text-white font-semibold"
        : tab.status === "Tuntas"
        ? "border-green-500 text-green-700 font-medium"
        : tab.status === "Menunggu Asesi"
        ? "border-blue-500 text-blue-600 font-medium"
        : tab.status === "Butuh Persetujuan"
        ? "border-yellow-500 text-yellow-600 font-medium"
        : "border-red-500 text-red-600 font-medium"
    }`}
                  >
                    {tab.name}
                  </button>
                ))}
            </div>
          </div>

          {/* Search + Generate */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md"
                autoFocus
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Tabel Responsif - Fixed Container */}
          <div className="bg-white rounded-md shadow">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 border-b text-left text-sm font-medium text-gray-700 min-w-[60px]">
                      No
                    </th>
                    <th className="px-4 py-3 border-b text-left text-sm font-medium text-gray-700 min-w-[200px]">
                      Nama Asesi
                    </th>
                    <th className="px-4 py-3 border-b text-center text-sm font-medium text-gray-700 min-w-[200px]">
                      Status
                    </th>
                    <th className="px-4 py-3 border-b text-center text-sm font-medium text-gray-700 min-w-[180px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : filteredAssesseeData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    filteredAssesseeData.map((asesi, index) => (
                      <tr
                        key={asesi.assessee_id}
                        className="hover:bg-gray-50 border-b border-gray-200"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {asesi.assessee_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          <span
                            className={`inline-flex items-center ${
                              badgeClasses[asesi.status]
                            } gap-1 px-2 py-1 text-center rounded-full text-xs font-medium ${
                              statusClasses[asesi.status]
                            }`}
                          >
                            {statusIcons[asesi.status]}
                            {asesi.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => {
                              console.log("asesi:", asesi.assessee_id);
                              console.log("Result:", asesi.result_id);
                              setSelectedAssessee(asesi);
                              handleActionClick(asesi.assessee_id);
                            }}
                            className="text-[#E77D35] underline text-sm hover:text-orange-600 cursor-pointer"
                          >
                            {getActionText()}
                          </button>

                          {/* Modal Penilaian */}
                          {selectedTab.toLowerCase() === "penilaian" && (
                            <button
                              className="text-[#E77D35] underline text-sm hover:text-orange-600 cursor-pointer"
                              onClick={() => {
                                setSelectedAssessee(asesi);
                                setModalPenilaianOpen(true);
                              }}
                            ></button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <InputScoreModal
        isOpen={isModalPenilaianOpen}
        onClose={() => setModalPenilaianOpen(false)}
        loading={savingPenilaian}
        title="Input Skor"
        initialScore={0}
        onSave={async (score) => {
          console.log("Saving score:", score);
          console.log("Selected Assessee:", selectedAssessee?.result_id);
          setSavingPenilaian(true);
          await handleSaveScore(score, selectedAssessee!.result_id);
          setSavingPenilaian(false);
          setModalPenilaianOpen(false);
        }}
      />
    </div>
  );
}

// Tambahkan style untuk menyembunyikan scrollbar
const style = document.createElement("style");
style.textContent = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);
