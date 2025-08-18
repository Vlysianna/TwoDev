import React, { useState, useEffect } from "react";
import SidebarAsesi from "@/components/SideAsesi";
import paths from '@/routes/paths';
import { 
    ListFilter, 
    Search, 
    LayoutDashboard, 
    Clock 
} from "lucide-react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { useAuth } from '@/contexts/AuthContext';
import { Link } from "react-router-dom";

export default function AsessmentAktif() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [assessments, setAssessments] = useState<any[]>([]);
    const [filteredAssessments, setFilteredAssessments] = useState<any[]>([]);

    useEffect(() => {
        // Data dummy
        const dummyData = [
            {
                id: 1,
                title: "Okupasi Junior Code",
                subtitle: "Rekayasa Perangkat Lunak (RPL)",
                status: "finished",
                statusText: "Finished",
                startDate: "24 Okt, 07:00pm",
                endDate: "25 Okt, 15:00pm",
                avatar: "EY",
                avatarBg: "bg-blue-500",
                instructor: "Eva Yepril",
                role: "Banding Asesmen",
                borderColor: "border-blue-400",
            },
            {
                id: 2,
                title: "Okupasi Web Developer",
                subtitle: "Sertifikasi Kompetensi",
                status: "active",
                statusText: "Aktif",
                startDate: "20 Okt, 09:00am",
                endDate: "22 Okt, 04:00pm",
                avatar: "AR",
                avatarBg: "bg-green-500",
                instructor: "Andi Rahman",
                role: "Asesor",
                borderColor: "border-green-400",
            }
        ];

        setAssessments(dummyData);
        setFilteredAssessments(dummyData);
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredAssessments(assessments);
        } else {
            const filtered = assessments.filter(assessment =>
                assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assessment.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAssessments(filtered);
        }
    }, [searchTerm, assessments]);

    const okupasiData = filteredAssessments;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md ">
                <SidebarAsesi />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-0 md:ml-0">
                {/* Navbar */}
                <div className="sticky top-0 z-10 bg-white shadow-sm">
                    <NavbarAsesi
                        title="Overview"
                        icon={<LayoutDashboard size={25} />}
                    />
                </div>

                <div className="p-6">
                    <main>
                        {/* Header dengan Search dan Filter */}
                        <div className="mb-6 p-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-600">Selamat datang,</span>
                                    <span className="font-semibold text-gray-900">{user?.email?.split('@')[0] || 'Asesi'}!</span>
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
                            {okupasiData.map((okupasi) => (
                                <div
                                    key={okupasi.id}
                                    className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-shadow relative`}
                                >
                                    {/* Garis bawah */}
                                    <div
                                        className={`absolute bottom-0 left-0 w-full h-1 rounded-b-xl ${okupasi.borderColor}`}
                                    />

                                    {/* Header Kartu */}
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    {okupasi.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {okupasi.subtitle}
                                                </p>

                                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{okupasi.statusText}</span>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            {okupasi.status === "finished" && (
                                                <div className="absolute top-4 right-4">
                                                    <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-medium">
                                                        Finished
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tanggal */}
                                    <div className="px-4 pt-3 pb-20">
                                        <div className="flex flex-col items-center">
                                            <div className="flex justify-between w-full text-sm text-gray-800 mb-2 font-medium">
                                                <span>{okupasi.startDate}</span>
                                                <span>{okupasi.endDate}</span>
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
                                                <div
                                                    className={`w-8 h-8 ${okupasi.avatarBg} rounded-full flex items-center justify-center text-white text-sm font-semibold`}
                                                >
                                                    {okupasi.avatar}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {okupasi.instructor}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {okupasi.role}
                                                    </p>
                                                </div>
                                            </div>

                                            <Link to={paths.asesi.apl01} className="text-sm text-gray-500 hover:underline cursor-pointer">
                                                Banding Asesmen
                                            </Link>
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