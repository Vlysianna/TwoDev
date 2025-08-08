import SidebarAsesi from '@/components/SideAsesi';
import Navbar from '../../components/NavAdmin';
import { Eye, Filter, Search, LayoutDashboard, Clock, ChevronRight } from "lucide-react";
import NavbarAsesi from '@/components/NavbarAsesi';

export default function AsessmentAktif() {
    const okupasiData = [
        {
            id: 1,
            title: "Okupasi Junior Code",
            subtitle: "Rekayasa Perangkat Lunak ( RPL )",
            status: "finished",
            statusText: "Sewaktu",
            startDate: "24 Okt, 07:00pm",
            endDate: "25 Okt, 18:00pm",
            avatar: "EY",
            avatarBg: "bg-blue-500",
            instructor: "Eva Yoanliani, S.kom",
            role: "Asesor",
            borderColor: "border-blue-400"
        },
        {
            id: 2,
            title: "Okupasi Front Office",
            subtitle: "Perhotelan ( PH )",
            status: "finished",
            statusText: "Sewaktu",
            startDate: "24 Okt, 07:00pm",
            endDate: "25 Okt, 18:00pm",
            avatar: "AA",
            avatarBg: "bg-gray-500",
            instructor: "Aan Apriansyh, S. Tr Par",
            role: "Asesor",
            borderColor: "border-gray-400"
        }
    ];

    return (
        <>
            <div className="flex min-h-screen bg-gray-50">

                <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md ">
                    <SidebarAsesi />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 lg:ml-0 md:ml-0">
                    {/* Navbar - Sticky di atas */}
                    <div className="sticky top-0 z-10 bg-white shadow-sm">
                        <NavbarAsesi title="Overview" icon={<LayoutDashboard size={25} />} />
                    </div>

                    {/* Konten Utama */}
                    <div className="p-6">
                        {/* Konten Utama ya buyunggggggggggggggggggggggggg */}
                        {/* Konten utama */}
                        <main className=" ">
                            <div className="p-6">
                                {/* Header dengan Search dan Filter */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-600">Selamat datang,</span>
                                            <span className="font-semibold text-gray-900">Asesi</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        {/* Search Bar */}
                                        <div className="relative flex-1 max-w-md">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        {/* Filter Button */}
                                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                            <Filter className="w-4 h-4 text-gray-600" />
                                            <span className="text-gray-600">Filter</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Grid Kartu Okupasi */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {okupasiData.map((okupasi) => (
                                        <div
                                            key={okupasi.id}
                                            className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-shadow relative`}
                                        >
                                            {/* Garis bawah biru */}
                                            <div className={`absolute bottom-0 left-0 w-full h-1 rounded-b-xl ${okupasi.borderColor}`} />

                                            {/* Header Kartu */}
                                            <div className="p-4 border-b border-gray-100">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 mb-1">{okupasi.title}</h3>
                                                        <p className="text-sm text-gray-600 mb-2">{okupasi.subtitle}</p>

                                                        {/* Status dengan Icon */}
                                                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{okupasi.statusText}</span>
                                                        </div>
                                                    </div>

                                                    {/* Status Badge di pojok kanan atas */}
                                                    {okupasi.status === 'finished' && (
                                                        <div className="absolute top-4 right-4">
                                                            <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-medium">
                                                                Finished
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Tanggal */}
                                            <div className="px-4 pt-3  pb-20">
                                                <div className="flex flex-col items-center">
                                                    {/* Tanggal dan waktu */}
                                                    <div className="flex justify-between w-full text-sm text-gray-800 mb-2 font-medium">
                                                        <span>{okupasi.startDate}</span>
                                                        <span>{okupasi.endDate}</span>
                                                    </div>

                                                    {/* Garis dan bulatan */}
                                                    <div className="relative w-full h-4 flex items-center">
                                                        <div className="absolute left-0 right-0 h-[2px] bg-black" />

                                                        <div className="w-4 h-4 bg-white border-2 border-black rounded-full z-10"></div>
                                                        <div className="flex-1"></div>
                                                        <div className="w-4 h-4 bg-white border-2 border-black rounded-full z-10"></div>
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
                                                            <p className="text-sm font-medium text-gray-900">{okupasi.instructor}</p>
                                                            <p className="text-xs text-gray-500">{okupasi.role}</p>
                                                        </div>
                                                    </div>

                                                    <button className="text-sm text-gray-700 hover:underline font-medium">
                                                        Lihat selengkapnya
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>

            </div>
        </>
    );
}
