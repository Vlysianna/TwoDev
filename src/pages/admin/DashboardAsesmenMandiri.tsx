import {
  Search,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  SquareX,
  Loader,
  CheckCircle,
  Trash2,
  AlertCircle,
} from "lucide-react";
import SideAdmin from "@/components/SideAdmin";
import NavAdmin from "@/components/NavAdmin";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import ApprovalConfirmModal from "@/components/ApprovalConfirmModal";
import { useEffect, useState, useRef, useCallback, type JSX } from "react";
import { Link } from "react-router-dom";
import api from "@/helper/axios";
import { useAssessmentParams } from "@/components/AssessmentAdminProvider";
import paths from "@/routes/paths";
import routes from "@/routes/paths";
import useToast from "@/components/ui/useToast";

interface AssesseeData {
  result_id: number;
  assessee_id: number;
  full_name: string;
  status: "Sedang Berjalan" | "Belum Kompeten" | "Kompeten";
  created_at: string;
  is_pending: boolean;
}

export default function DashboardAsesmenMandiriAdmin() {
  const { id_schedule: id_assessment, id_asesor } = useAssessmentParams();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [assesseeData, setAssesseeData] = useState<AssesseeData[]>([]);
  console.log(assesseeData);
  const [filteredAssesseeData, setFilteredAssesseeData] = useState<
    AssesseeData[]
  >([]);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [assesseeToDelete, setAssesseeToDelete] = useState<AssesseeData | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pendingApprovalData, setPendingApprovalData] = useState<{
    approver_admin_id: number;
    backup_admin_id?: number;
    comment: string;
  } | null>(null);

  const toast = useToast();
  const [previousDataLength, setPreviousDataLength] = useState<number>(0);

  const fetchAssesseeData = useCallback(
    async (silent = false) => {
      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null); // Reset error state
        const response = await api.get(
          `/assessments/results/status/admin/assessees/${id_assessment}/${id_asesor}`,
        );
        console.log("🔍 Verification - API Response:", response.data);
        if (response.data.success) {
          const sortedData = response.data.data.sort(
            (a: AssesseeData, b: AssesseeData) => {
              const order = {
                "Belum Kompeten": 0,
                "Sedang Berjalan": 1,
                Kompeten: 2,
              };

              // Bandingkan status dulu
              const statusDiff = order[a.status] - order[b.status];
              if (statusDiff !== 0) return statusDiff;

              // Kalau status sama, bandingkan huruf pertama dari nama asesi
              const nameA = a.full_name.toUpperCase();
              const nameB = b.full_name.toUpperCase();
              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            },
          );

          // Check if data has changed and show notification
          if (
            silent &&
            previousDataLength > 0 &&
            sortedData.length < previousDataLength
          ) {
            toast.show({
              title: "Data Diperbarui",
              description: `${previousDataLength - sortedData.length} asesi telah dihapus dari asesmen`,
              type: "info",
            });
          }

          setAssesseeData(sortedData);
          setPreviousDataLength(sortedData.length);
          console.log("✅ Verification - Final data set:", sortedData);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch assessee data:", error);
        setError("Gagal memuat data asesi");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id_assessment, id_asesor, toast, previousDataLength],
  );

  useEffect(() => {
    fetchAssesseeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto refresh every 30 seconds to check for approval updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAssesseeData(true); // Silent refresh
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchAssesseeData]);

  // Refresh data when window gains focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      fetchAssesseeData(true); // Silent refresh
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchAssesseeData]);

  useEffect(() => {
    setFilteredAssesseeData(assesseeData);
  }, [assesseeData]);

  useEffect(() => {
    setFilteredAssesseeData(
      assesseeData.filter((assessee) => {
        return assessee.full_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }),
    );
  }, [searchTerm, assesseeData]);

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
      checkScroll(); // Check initial state
    }

    return () => {
      if (tabsContainerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const statusClasses: Record<string, string> = {
    "Belum Kompeten": "text-red-500",
    "Sedang Berjalan": "text-blue-500",
    Kompeten: "text-green-500",
  };

  const statusIcons: Record<string, JSX.Element> = {
    "Belum Selesai": <SquareX size={14} />,
    "Sedang Berjalan": <Loader size={14} />,
    Selesai: <CheckCircle size={14} />,
  };

  const handleDeleteClick = (assessee: AssesseeData) => {
    console.log("🗑️ Delete clicked - Assessee data:", {
      assessee_id: assessee.assessee_id,
      result_id: assessee.result_id,
      full_name: assessee.full_name,
      entire_object: assessee,
    });
    setAssesseeToDelete(assessee);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assesseeToDelete) return;

    try {
      setDeleteLoading(true);
      if (!pendingApprovalData) {
        setIsApprovalModalOpen(true);
        return;
      }

      const headers: Record<string, string> = {
        "x-approver-admin-id": pendingApprovalData.approver_admin_id.toString(),
        "x-approval-comment": pendingApprovalData.comment,
      };

      if (pendingApprovalData.backup_admin_id) {
        headers["x-backup-admin-id"] =
          pendingApprovalData.backup_admin_id.toString();
      }

      // Create approval request instead of direct delete
      console.log("📤 Sending approval request with ID:", {
        target_id: assesseeToDelete.assessee_id,
        targetTable: "assessee",
        action: "delete",
        assesseeToDelete: assesseeToDelete,
      });

      const response = await api.post("/approval/request", {
        targetTable: "assessee",
        target_id: assesseeToDelete.assessee_id,
        action: "delete",
        approverAdminId: pendingApprovalData.approver_admin_id,
        backupAdminId: pendingApprovalData.backup_admin_id,
        comment: pendingApprovalData.comment,
      });

      console.log("📥 Approval request created:", response.data);

      await fetchAssesseeData(); // Refresh the list
      setIsDeleteModalOpen(false);
      setAssesseeToDelete(null);
      setPendingApprovalData(null);
      toast.show({
        title: "Berhasil",
        description:
          "Permintaan penghapusan asesi telah dikirim untuk persetujuan",
        type: "success",
      });
    } catch (error: unknown) {
      console.error("Error deleting assessee:", error);
      const msg =
        (error as Error & { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Gagal menghapus asesi dari asesmen";
      toast.show({
        title: "Gagal",
        description: msg,
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const canDelete = (assessee: AssesseeData) => {
    return assessee.status !== "Kompeten";
  };

  const isDeleteDisabled = (assessee: AssesseeData) => {
    return assessee.is_pending || assessee.status === "Kompeten";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md flex-shrink-0">
        <SideAdmin />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <NavAdmin
            title="Asesmen Mandiri"
            icon={<LayoutDashboard size={25} />}
          />
        </div>

        {/* Breadcrumb + Content */}
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-4">
            <Link
              to={paths.admin.resultAssessment.root}
              className="hover:underline"
            >
              Hasil Asesmen
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Asesmen Mandiri</span>
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
          </div>

          {/* Search + Refresh Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            {/* Info Banner for Pending Items */}
            {filteredAssesseeData.some((asesi) => asesi.is_pending) && (
              <div className="w-full mb-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-800">
                    Ada{" "}
                    {
                      filteredAssesseeData.filter((asesi) => asesi.is_pending)
                        .length
                    }{" "}
                    asesi yang sedang menunggu persetujuan penghapusan. Data
                    akan diperbarui otomatis setelah persetujuan diproses.
                  </span>
                </div>
              </div>
            )}
          </div>

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

            {/* Refresh Button */}
            <div className="flex items-center gap-2">
              {refreshing && (
                <span className="text-sm text-blue-600 flex items-center gap-1">
                  <Loader className="w-4 h-4 animate-spin" />
                  Memeriksa pembaruan...
                </span>
              )}
              <button
                onClick={() => fetchAssesseeData()}
                disabled={loading || refreshing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                title="Refresh data untuk memeriksa perubahan terbaru dari persetujuan"
              >
                <Loader
                  className={`w-4 h-4 ${loading || refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Checking..." : "Refresh"}
              </button>
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
                    <th className="px-4 py-3 border-b text-center text-sm font-medium text-gray-700 min-w-[150px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-sm text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : filteredAssesseeData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
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
                          {asesi.full_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 text-center rounded-full text-xs font-medium ${
                                statusClasses[asesi.status]
                              }`}
                            >
                              {statusIcons[asesi.status]}
                              {asesi.status}
                            </span>
                            {asesi.is_pending && (
                              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                                Menunggu persetujuan
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                localStorage.setItem(
                                  "assessee_name",
                                  asesi.full_name,
                                );
                                window.open(
                                  paths.basename +
                                    routes.admin.resultAssessment.resultAsesi(
                                      id_assessment,
                                      id_asesor!,
                                      asesi.assessee_id,
                                    ),
                                );
                              }}
                              className="text-[#E77D35] underline text-sm hover:text-orange-600 cursor-pointer"
                            >
                              {"Lihat Hasil >"}
                            </button>
                            {canDelete(asesi) && (
                              <button
                                onClick={() => handleDeleteClick(asesi)}
                                disabled={isDeleteDisabled(asesi)}
                                className={`p-1 rounded-md transition-colors ${
                                  isDeleteDisabled(asesi)
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-red-500 hover:bg-red-50 cursor-pointer"
                                }`}
                                title={
                                  asesi.is_pending
                                    ? "Tidak dapat menghapus saat proses sedang berjalan"
                                    : asesi.status === "Kompeten"
                                      ? "Tidak dapat menghapus asesi dengan status kompeten"
                                      : "Hapus dari asesmen"
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && assesseeToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            setIsApprovalModalOpen(true);
          }}
          loading={deleteLoading}
          title="Hapus Asesi dari Asesmen"
          message={`Apakah Anda yakin ingin menghapus "${assesseeToDelete.full_name}" dari asesmen ini? Tindakan ini tidak dapat dibatalkan.`}
        />
      )}

      {/* Approval Modal */}
      {isApprovalModalOpen && (
        <ApprovalConfirmModal
          isOpen={isApprovalModalOpen}
          onClose={() => {
            setIsApprovalModalOpen(false);
            setPendingApprovalData(null);
          }}
          onConfirm={(data) => {
            setPendingApprovalData(data);
            setIsApprovalModalOpen(false);
            void handleDeleteConfirm();
          }}
          title="Persetujuan Penghapusan"
          subtitle="Pilih 1 admin untuk menyetujui penghapusan asesi dari asesmen ini."
          loading={deleteLoading}
        />
      )}
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
