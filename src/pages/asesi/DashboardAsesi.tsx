import React, { useState, useEffect } from 'react';
import SidebarAsesi from '@/components/SideAsesi';
import Navbar from '../../components/NavAdmin';
import { Eye, ListFilter, Search, LayoutDashboard, Clock, ChevronRight, User, Calendar, BookOpen, AlertCircle } from "lucide-react";
import NavbarAsesi from '@/components/NavbarAsesi';
import { Link } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';

interface Assessment {
    id: number;
    title: string;
    subtitle: string;
    status: string;
    startDate: string;
    endDate: string;
    avatar: string;
    avatarBg: string;
    instructor: string;
    role: string;
    borderColor: string;
    scheme?: {
        name: string;
        code: string;
    };
    occupation?: {
        name: string;
    };
}

export default function DashboardAsesi() {
    const { user } = useAuth();
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
    const [assesseeProfile, setAssesseeProfile] = useState<any>(null);

    const sampleAssessments: Assessment[] = [
        {
            id: 1,
            title: "Okupasi Junior Code",
            subtitle: "Rekayasa Perangkat Lunak ( RPL )",
            status: "Aktif",
            startDate: "24 Okt, 07:00",
            endDate: "25 Okt, 18:00",
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
            status: "Menunggu",
            startDate: "24 Okt, 09:00",
            endDate: "25 Okt, 18:00",
            avatar: "AA",
            avatarBg: "bg-gray-500",
            instructor: "Aan Apriansyh, S. Tr Par",
            role: "Asesor",
            borderColor: "border-gray-400"
        },
        {
            id: 3,
            title: "Okupasi Pastry & Confictionary",
            subtitle: "Tata Boga ( TBG )",
            status: "Selesai",
            startDate: "20 Okt, 07:00",
            endDate: "21 Okt, 18:00",
            avatar: "EY",
            avatarBg: "bg-green-500",
            instructor: "Eva Yapril",
            role: "Asesor",
            borderColor: "border-green-400"
        }
    ];

    useEffect(() => {
        fetchAssessments();
        fetchAssesseeProfile();
    }, [user]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = assessments.filter(assessment =>
                assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assessment.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assessment.instructor.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAssessments(filtered);
        } else {
            setFilteredAssessments(assessments);
        }
    }, [searchTerm, assessments]);

    const fetchAssesseeProfile = async () => {
        if (!user?.id) return;
        
        try {
            const response = await api.get(`/assessee/user/${user.id}`);
            if (response.data.success) {
                setAssesseeProfile(response.data.data);
            }
        } catch (error) {
            console.log('No assessee profile found or error fetching profile');
        }
    };

    const fetchAssessments = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try to fetch real data from API
            const response = await api.get('/assessment/apl2');
            
            if (response.data.success && response.data.data.length > 0) {
                // Map API data to our format
                const mappedAssessments = response.data.data.map((item: any, index: number) => ({
                    id: item.id || index + 1,
                    title: item.occupation?.name || `Assessment ${index + 1}`,
                    subtitle: item.scheme?.name || 'Sertifikasi Kompetensi',
                    status: getStatusFromSchedule(item.assessment_schedule),
                    startDate: formatDateFromSchedule(item.assessment_schedule, 'start'),
                    endDate: formatDateFromSchedule(item.assessment_schedule, 'end'),
                    avatar: getInitials(item.assessment_schedule?.[0]?.assessor?.full_name || 'Unknown'),
                    avatarBg: getRandomColor(index),
                    instructor: item.assessment_schedule?.[0]?.assessor?.full_name || 'Asesor',
                    role: "Asesor",
                    borderColor: getBorderColor(index),
                    scheme: item.occupation?.scheme,
                    occupation: item.occupation
                }));
                setAssessments(mappedAssessments);
            } else {
                // Use sample data if no real data
                setAssessments(sampleAssessments);
            }
        } catch (error: any) {
            console.log('Error fetching assessments, using sample data:', error);
            setError('Gagal memuat data asesmen. Menampilkan data contoh.');
            // Fallback to sample data
            setAssessments(sampleAssessments);
        } finally {
            setLoading(false);
        }
    };

    const getStatusFromSchedule = (schedules: any[]) => {
        if (!schedules || schedules.length === 0) return 'Belum Dijadwalkan';
        
        const now = new Date();
        const schedule = schedules[0]; // Take first schedule
        const start = new Date(schedule.start_date);
        const end = new Date(schedule.end_date);
        
        if (now < start) return 'Menunggu';
        if (now >= start && now <= end) return 'Aktif';
        return 'Selesai';
    };

    const formatDateFromSchedule = (schedules: any[], type: 'start' | 'end') => {
        if (!schedules || schedules.length === 0) return 'TBD';
        
        const schedule = schedules[0];
        const dateString = type === 'start' ? schedule.start_date : schedule.end_date;
        
        if (!dateString) return 'TBD';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusFromDate = (startDate: string, endDate: string) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (now < start) return 'Menunggu';
        if (now >= start && now <= end) return 'Aktif';
        return 'Selesai';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getRandomColor = (index: number) => {
        const colors = ['bg-blue-500', 'bg-gray-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
        return colors[index % colors.length];
    };

    const getBorderColor = (index: number) => {
        const colors = ['border-blue-400', 'border-gray-400', 'border-green-400', 'border-purple-400', 'border-pink-400', 'border-indigo-400'];
        return colors[index % colors.length];
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aktif': return 'text-green-600 bg-green-50 border-green-200';
            case 'Menunggu': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'Selesai': return 'text-gray-600 bg-gray-50 border-gray-200';
            default: return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

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
                        <NavbarAsesi title="Dashboard Asesi" icon={<LayoutDashboard size={25} />} />
                    </div>

                    {/* Konten Utama */}
                    <div className="p-6">
                        {/* Error notification */}
                        {error && (
                            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
                                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                                <span className="text-yellow-800">{error}</span>
                            </div>
                        )}
                        
                        <main>
                            {/* Welcome Section */}
                            <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                            Selamat Datang, {user?.email?.split('@')[0] || 'Asesi'}! 👋
                                        </h1>
                                        <p className="text-gray-600">
                                            Kelola assessment dan sertifikasi kompetensi Anda di sini.
                                        </p>
                                    </div>
                                    <div className="hidden md:flex items-center space-x-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{filteredAssessments.length}</div>
                                            <div className="text-sm text-gray-500">Total Assessment</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {filteredAssessments.filter(a => a.status === 'Selesai').length}
                                            </div>
                                            <div className="text-sm text-gray-500">Selesai</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link 
                                    to={paths.asesi.apl01}
                                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <BookOpen className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">APL-01</h3>
                                            <p className="text-sm text-gray-600">Formulir Permohonan</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link 
                                    to={paths.asesi.apl02}
                                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                            <Calendar className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">APL-02</h3>
                                            <p className="text-sm text-gray-600">Formulir Self Assessment</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link 
                                    to={paths.asesi.dataSertifikasi}
                                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                            <User className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Sertifikasi</h3>
                                            <p className="text-sm text-gray-600">Data Sertifikat</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Header dengan Search dan Filter */}
                            <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Assessment Saya</h2>
                                        <p className="text-sm text-gray-600">Daftar assessment yang tersedia untuk Anda</p>
                                    </div>

                                    {/* Search + Filter */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-full md:w-80">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Cari assessment..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <button className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                            <ListFilter className="w-4 h-4 text-gray-600" />
                                            <span className="text-gray-600">Filter</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Loading State */}
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                                            <div className="p-4 border-b border-gray-100">
                                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                            <div className="p-4">
                                                <div className="h-20 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* Grid Kartu Assessment */
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredAssessments.length > 0 ? (
                                        filteredAssessments.map((assessment) => (
                                            <div key={assessment.id} className={`bg-white rounded-lg shadow-sm border-b-4 ${assessment.borderColor} hover:shadow-md transition-all duration-200 group`}>
                                                {/* Header Kartu */}
                                                <div className="p-4 border-b border-gray-100">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                {assessment.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mt-1">{assessment.subtitle}</p>
                                                        </div>
                                                        <Link
                                                            to={paths.asesi.apl01}
                                                            className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors group-hover:scale-110 transform"
                                                        >
                                                            <ChevronRight className="w-4 h-4 text-white" />
                                                        </Link>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(assessment.status)}`}>
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {assessment.status}
                                                    </div>
                                                </div>

                                                {/* Timeline */}
                                                <div className="px-4 py-3">
                                                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                                                        <span>Mulai: {assessment.startDate}</span>
                                                        <span>Selesai: {assessment.endDate}</span>
                                                    </div>

                                                    {/* Progress Line */}
                                                    <div className="relative">
                                                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
                                                        <div className="flex justify-between items-center relative">
                                                            <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></div>
                                                            <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Instructor Info */}
                                                <div className="px-4 pb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-8 h-8 ${assessment.avatarBg} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                                                            {assessment.avatar}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">{assessment.instructor}</p>
                                                            <p className="text-xs text-gray-500">{assessment.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada assessment</h3>
                                            <p className="text-gray-600 mb-4">
                                                {searchTerm ? 'Tidak ada assessment yang sesuai dengan pencarian Anda.' : 'Assessment akan muncul di sini setelah Anda mendaftar.'}
                                            </p>
                                            {!searchTerm && (
                                                <Link 
                                                    to={paths.asesi.apl01}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Mulai Assessment
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
