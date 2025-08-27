import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ListFilter,
  Search,
  LayoutDashboard,
  Clock,
  ChevronRight,
  MapPinned,
} from "lucide-react";
import { Link } from "react-router-dom";
import SidebarAsesor from "@/components/SideAsesor";
import NavbarAsesor from "@/components/NavAsesor";
import api from '@/helper/axios';

const DashboardAsesor: React.FC = () => {
  const { user } = useAuth();

  const defaultOkupasi = [
    {
      id: 1,
      title: "Okupasi Junior Code",
      subtitle: "Rekayasa Perangkat Lunak ( RPL )",
      status: "Sewaktu",
      startDate: "24 Okt, 07:00pm",
      endDate: "25 Okt, 15:00pm",
      avatar: "EY",
      avatarBg: "bg-[#60B5FF]",
      instructor: "Eva Yeprilianti, S.Kom",
      role: "Asesor",
      borderColor: "border-[#60B5FF]",
      location: "Lab 1",
    },
    {
      id: 2,
      title: "Okupasi Front Office",
      subtitle: "Perhotelan ( PH )",
      status: "Sewaktu",
      startDate: "24 Okt, 07:00pm",
      endDate: "25 Okt, 15:00pm",
      avatar: "AA",
      avatarBg: "bg-[#7A7A73]",
      instructor: "Aan Aspriansya, S.Tr.Par",
      role: "Asesor",
      borderColor: "border-[#7A7A73]",
      location: "Lab 2",
    },
    {
      id: 3,
      title: "Okupasi Pastry & Confictionary",
      subtitle: "Tata Boga ( TBG )",
      status: "Sewaktu",
      startDate: "24 Okt, 07:00pm",
      endDate: "25 Okt, 15:00pm",
      avatar: "IW",
      avatarBg: "bg-[#FF7A30]",
      instructor: "Ibnu Widianto, S.Pd",
      role: "Asesor",
      borderColor: "border-[#FF7A30]",
      location: "Lab 3",
    },
    {
      id: 4,
      title: "Okupasi Tour Planning",
      subtitle: "Usaha Layanan Wisata ( ULW )",
      status: "Sewaktu",
      startDate: "24 Okt, 07:00pm",
      endDate: "25 Okt, 15:00pm",
      avatar: "AW",
      avatarBg: "bg-[#640D5F]",
      instructor: "Ana Wijayanti, A.Md",
      role: "Asesor",
      borderColor: "border-[#640D5F]",
      location: "Lab 4",
    },
    {
      id: 5,
      title: "Okupasi Menjahit Rok",
      subtitle: "Tata Busana ( TBS )",
      status: "Sewaktu",
      startDate: "24 Okt, 07:00pm",
      endDate: "25 Okt, 15:00pm",
      avatar: "ES",
      avatarBg: "bg-[#B33791]",
      instructor: "Eni Susilawanti, S.Pd",
      role: "Asesor",
      borderColor: "border-[#B33791]",
      location: "Lab 5",
    },
  ];

  interface ScheduleDetail { id: number; assessor?: { id: number; full_name?: string }; location?: string }
  interface ScheduleItem { id: number; assessment: { id:number; code?:string; occupation?: { name?: string } }; start_date?: string | null; end_date?: string | null; schedule_details?: ScheduleDetail[] }
  type DefaultOkupasiItem = (typeof defaultOkupasi)[number];
  type RenderItem = ScheduleItem | DefaultOkupasiItem;
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        // get assessor record
        const assessorRes = await api.get(`/assessor/user/${user.id}`);
        if (!assessorRes.data?.success) {
          setError('Gagal mengambil data assessor');
          return;
        }
        const assessor = assessorRes.data.data;
        const assessorId = assessor?.id;

        // get all schedules then filter those that include assessorId
        const schedRes = await api.get('/schedules');
        if (!schedRes.data?.success) {
          setError('Gagal mengambil jadwal');
          return;
        }
  const list: ScheduleItem[] = schedRes.data.data || [];
  const mySchedules = list.filter(s => s.schedule_details?.some((d: ScheduleDetail) => d.assessor?.id === assessorId));
  setSchedules(mySchedules);
      } catch (e) {
        console.error(e);
        setError('Gagal memuat jadwal');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
        <SidebarAsesor />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <NavbarAsesor title="Dashboard Asesor" icon={<LayoutDashboard size={25} />} />
        </div>

        {/* Main Body */}
        <main className="p-6">
          {/* Header Welcome + Search + Filter */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Selamat datang,</span>
                <span className="font-semibold text-gray-900">
                  {user?.email || "Asesor"}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50">
                  <ListFilter className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">Filter</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-2 mt-6">
              <button className="px-8 py-2 rounded-md bg-[#E77D35] text-white">
                RPL (3)
              </button>
              <button className="px-8 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                TBG (3)
              </button>
              <button className="px-8 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                TBS (3)
              </button>
              <button className="px-8 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                PH (5)
              </button>
              <button className="px-8 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                ULW (3)
              </button>
            </div>
          </div>

          {/* Grid Okupasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">Memuat jadwal...</div>
            ) : error ? (
              <div className="col-span-full text-center py-12 text-red-600">{error}</div>
            ) : (
              ((schedules && schedules.length > 0) ? schedules : defaultOkupasi).map((item: RenderItem) => {
                const isDefault = schedules.length === 0;
                const key = item.id;

                const isSchedule = (it: RenderItem): it is ScheduleItem => {
                  return (it as ScheduleItem).assessment !== undefined;
                };

                const title = isSchedule(item) ? (item.assessment?.occupation?.name || `Assessment ${item.assessment?.code || item.assessment?.id}`) : item.title;
                const subtitle = isSchedule(item) ? (item.assessment?.code || '') : item.subtitle;
                const location = isSchedule(item) ? (item.schedule_details?.[0]?.location || '-') : item.location;
                const startDate = isSchedule(item) ? (item.start_date ? new Date(item.start_date).toLocaleString() : 'TBD') : item.startDate;
                const endDate = isSchedule(item) ? (item.end_date ? new Date(item.end_date).toLocaleString() : 'TBD') : item.endDate;
                const avatar = isSchedule(item) ? (item.schedule_details?.[0]?.assessor?.full_name?.split(' ').map((s:string)=>s[0]).slice(0,2).join('') || 'AS') : item.avatar;
                const avatarBg = isSchedule(item) ? 'bg-[#60B5FF]' : item.avatarBg;
                const borderColor = isSchedule(item) ? 'border-[#60B5FF]' : item.borderColor;

                return (
                  <div
                    key={key}
                    className={`bg-white rounded-lg shadow-sm border-b-4 ${borderColor} hover:shadow-md transition-shadow`}
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Jadwal</span>
                      </div>
                    </div>

                    {/* Lokasi */}
                    <div className="flex items-center justify-center mt-3 text-sm">
                      <MapPinned className="w-5 h-5 mr-1" />
                      <span>{location}</span>
                    </div>

                    {/* Timeline */}
                    <div className="px-4 pt-3 pb-10">
                      <div className="flex flex-col items-center">
                        <div className="flex justify-between w-full text-sm text-gray-500 mb-2">
                          <span>{startDate}</span>
                          <span>{endDate}</span>
                        </div>
                        <div className="relative w-full h-4 flex items-center">
                          <div className="absolute left-0 right-0 h-[2px] bg-gray-300" />
                          <div className="w-4 h-4 bg-white border-4 border-gray-400 rounded-full z-2"></div>
                          <div className="flex-1"></div>
                          <div className="w-4 h-4 bg-white border-4 border-gray-400 rounded-full z-2"></div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center text-white text-sm font-medium`}>{avatar}</div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{isDefault ? (item as DefaultOkupasiItem).instructor : (item as ScheduleItem).schedule_details?.[0]?.assessor?.full_name || 'Asesor'}</p>
                            <p className="text-xs text-gray-500">{isDefault ? (item as DefaultOkupasiItem).role : 'Asesor'}</p>
                          </div>
                        </div>
                        <Link to="/asesor/apl-01" className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                          <ChevronRight className="w-4 h-4 text-white" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAsesor;
