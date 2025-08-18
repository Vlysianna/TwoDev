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
    program: string; // Tambahan untuk menyimpan program/jurusan
    scheme?: {
        name: string;
        code: string;
    };
    occupation?: {
        name: string;
    };
}

interface ProgramFilter {
    code: string;
    name: string;
    count: number;
    color: string;
}

export default function DashboardAsesi() {
    const { user } = useAuth();
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
    const [assesseeProfile, setAssesseeProfile] = useState<any>(null);
    const [selectedProgram, setSelectedProgram] = useState<string>('ALL');
    const [programFilters, setProgramFilters] = useState<ProgramFilter[]>([]);

    const sampleAssessments: Assessment[] = [
        {
            id: 1,
            title: "Okupasi Junior Web Developer",
            subtitle: "Rekayasa Perangkat Lunak ( RPL )",
            status: "Aktif",
            startDate: "24 Okt, 07:00",
            endDate: "25 Okt, 18:00",
            avatar: "EY",
            avatarBg: "bg-blue-500",
            instructor: "Eva Yoanliani, S.Kom",
            role: "Asesor",
            borderColor: "border-blue-400",
            program: "RPL"
        },
        {
            id: 2,
            title: "Okupasi Software Tester",
            subtitle: "Rekayasa Perangkat Lunak ( RPL )",
            status: "Menunggu",
            startDate: "26 Okt, 08:00",
            endDate: "27 Okt, 17:00",
            avatar: "BF",
            avatarBg: "bg-blue-600",
            instructor: "Budi Firmansyah, S.T",
            role: "Asesor",
            borderColor: "border-blue-400",
            program: "RPL"
        },
        {
            id: 3,
            title: "Okupasi Database Administrator",
            subtitle: "Rekayasa Perangkat Lunak ( RPL )",
            status: "Selesai",
            startDate: "20 Okt, 07:00",
            endDate: "21 Okt, 18:00",
            avatar: "AS",
            avatarBg: "bg-blue-700",
            instructor: "Ahmad Sutrisno, M.Kom",
            role: "Asesor",
            borderColor: "border-blue-400",
            program: "RPL"
        },
        {
            id: 4,
            title: "Okupasi Front Office",
            subtitle: "Perhotelan ( PH )",
            status: "Aktif",
            startDate: "24 Okt, 09:00",
            endDate: "25 Okt, 18:00",
            avatar: "AA",
            avatarBg: "bg-purple-500",
            instructor: "Aan Apriansyh, S. Tr Par",
            role: "Asesor",
            borderColor: "border-purple-400",
            program: "PH"
        },
        {
            id: 5,
            title: "Okupasi Housekeeping",
            subtitle: "Perhotelan ( PH )",
            status: "Menunggu",
            startDate: "28 Okt, 08:00",
            endDate: "29 Okt, 17:00",
            avatar: "SM",
            avatarBg: "bg-purple-600",
            instructor: "Siti Maryam, S.Par",
            role: "Asesor",
            borderColor: "border-purple-400",
            program: "PH"
        },
        {
            id: 6,
            title: "Okupasi Pastry & Bakery",
            subtitle: "Tata Boga ( TBG )",
            status: "Selesai",
            startDate: "20 Okt, 07:00",
            endDate: "21 Okt, 18:00",
            avatar: "EY",
            avatarBg: "bg-green-500",
            instructor: "Eva Yapril, S.Pd",
            role: "Asesor",
            borderColor: "border-green-400",
            program: "TBG"
        },
        {
            id: 7,
            title: "Okupasi Western Food",
            subtitle: "Tata Boga ( TBG )",
            status: "Aktif",
            startDate: "25 Okt, 07:00",
            endDate: "26 Okt, 18:00",
            avatar: "RH",
            avatarBg: "bg-green-600",
            instructor: "Rahman Hakim, S.Par",
            role: "Asesor",
            borderColor: "border-green-400",
            program: "TBG"
        },
        {
            id: 8,
            title: "Okupasi Fashion Design",
            subtitle: "Tata Busana ( TBS )",
            status: "Menunggu",
            startDate: "27 Okt, 08:00",
            endDate: "28 Okt, 17:00",
            avatar: "NF",
            avatarBg: "bg-pink-500",
            instructor: "Nina Fatmawati, S.Pd",
            role: "Asesor",
            borderColor: "border-pink-400",
            program: "TBS"
        },
        {
            id: 9,
            title: "Okupasi Pattern Making",
            subtitle: "Tata Busana ( TBS )",
            status: "Aktif",
            startDate: "24 Okt, 08:00",
            endDate: "25 Okt, 17:00",
            avatar: "DS",
            avatarBg: "bg-pink-600",
            instructor: "Dewi Sartika, M.Pd",
            role: "Asesor",
            borderColor: "border-pink-400",
            program: "TBS"
        },
        {
            id: 10,
            title: "Okupasi Tour Guide",
            subtitle: "Usaha Layanan Wisata ( ULW )",
            status: "Aktif",
            startDate: "24 Okt, 09:00",
            endDate: "25 Okt, 18:00",
            avatar: "TP",
            avatarBg: "bg-teal-500",
            instructor: "Toni Prasetyo, S.Par",
            role: "Asesor",
            borderColor: "border-teal-400",
            program: "ULW"
        },
        {
            id: 11,
            title: "Okupasi Travel Agent",
            subtitle: "Usaha Layanan Wisata ( ULW )",
            status: "Menunggu",
            startDate: "30 Okt, 08:00",
            endDate: "31 Okt, 17:00",
            avatar: "MR",
            avatarBg: "bg-teal-600",
            instructor: "Maya Rahayu, S.Par",
            role: "Asesor",
            borderColor: "border-teal-400",
            program: "ULW"
        }
    ];

    useEffect(() => {
        fetchAssessments();
        fetchAssesseeProfile();
    }, [user]);

    useEffect(() => {
        // Update program filters whenever assessments change
        updateProgramFilters();
    }, [assessments]);

    useEffect(() => {
        // Apply both search and program filters
        let filtered = assessments;

        // Filter by program
        if (selectedProgram !== 'ALL') {
            filtered = filtered.filter(assessment => assessment.program === selectedProgram);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(assessment =>
                assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assessment.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assessment.instructor.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredAssessments(filtered);
    }, [searchTerm, assessments, selectedProgram]);

    const updateProgramFilters = () => {
        // Count assessments per program
        const programCounts = assessments.reduce((acc, assessment) => {
            const program = assessment.program;
            acc[program] = (acc[program] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Create filter options with colors
        const programColors = {
            'RPL': 'bg-orange-500',
            'TBG': 'bg-green-500',
            'TBS': 'bg-pink-500',
            'PH': 'bg-purple-500',
            'ULW': 'bg-teal-500',
            'TKJ': 'bg-indigo-500',
            'MM': 'bg-red-500',
            'OTKP': 'bg-yellow-500',
            'AKL': 'bg-blue-500'
        };

        const filters: ProgramFilter[] = Object.entries(programCounts).map(([program, count]) => ({
            code: program,
            name: getProgramFullName(program),
            count,
            color: programColors[program as keyof typeof programColors] || 'bg-gray-500'
        }));

        // Sort by count (descending)
        filters.sort((a, b) => b.count - a.count);

        setProgramFilters(filters);
    };

    const getProgramFullName = (code: string): string => {
        const programNames = {
            'RPL': 'Rekayasa Perangkat Lunak',
            'TBG': 'Tata Boga',
            'TBS': 'Tata Busana',
            'PH': 'Perhotelan',
            'ULW': 'Usaha Layanan Wisata',
            'OTKP': 'Otomatisasi Tata Kelola Perkantoran',
            'AKL': 'Akuntansi Keuangan Lembaga'
        };
        return programNames[code as keyof typeof programNames] || code;
    };

    const extractProgramFromSubtitle = (subtitle: string): string => {
        // Extract program code from subtitle like "Rekayasa Perangkat Lunak ( RPL )"
        const match = subtitle.match(/\(\s*([^)]+)\s*\)$/);
        return match ? match[1].trim() : 'OTHER';
    };

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

            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Use dummy/sample data only
            setAssessments(sampleAssessments);
        } catch (error: any) {
            console.log('Error loading assessments:', error);
            setError('Gagal memuat data asesmen.');
            setAssessments(sampleAssessments);
        } finally {
            setLoading(false);
        }
    };

    const getStatusFromSchedule = (schedules: any[]) => {
        if (!schedules || schedules.length === 0) return 'Sewaktu';

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
                            {/* Header dengan Search dan Filter */}
                            <div className="mb-6 p-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600">Selamat datang,</span>
                                        <span className="font-semibold text-gray-900">{user?.email?.split('@')[0] || 'Asesi'}!</span>
                                    </div>

                                    {/* Search + Filter */}
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

                            {/* Program Filter Pills */}
                            <div className="mb-6 px-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* All Filter */}
                                    <button
                                        onClick={() => setSelectedProgram('ALL')}
                                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedProgram === 'ALL'
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Semua
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedProgram === 'ALL'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {assessments.length}
                                        </span>
                                    </button>

                                    {/* Program Filters */}
                                    {programFilters.map((filter) => (
                                        <button
                                            key={filter.code}
                                            onClick={() => setSelectedProgram(filter.code)}
                                            className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium transition-all ${selectedProgram === filter.code
                                                ? `${filter.color} text-white`
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {filter.code}
                                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedProgram === filter.code
                                                ? 'text-white'
                                                : 'text-gray-600'
                                                }`}>
                                                ( {filter.count} )
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Selected Program Info */}
                                {selectedProgram !== 'ALL' && (
                                    <div className="mt-3 text-sm text-gray-600">
                                        Menampilkan {filteredAssessments.length} assessment dari jurusan{' '}
                                        <span className="font-semibold">
                                            {getProgramFullName(selectedProgram)} ({selectedProgram})
                                        </span>
                                    </div>
                                )}
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
                                                        {/* Program Badge */}
                                                        <div className="ml-2">
                                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                                {assessment.program}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(assessment.status)}`}>
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {assessment.status}
                                                    </div>
                                                </div>

                                                {/* Timeline */}
                                                <div className="px-4 py-7">
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
                                                <div className="px-4 pb-4 pt-8">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-8 h-8 ${assessment.avatarBg} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                                                            {assessment.avatar}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">{assessment.instructor}</p>
                                                            <p className="text-xs text-gray-500">{assessment.role}</p>
                                                        </div>
                                                        <Link
                                                            to={paths.asesi.apl01}
                                                            className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors group-hover:scale-110 transform"
                                                        >
                                                            <ChevronRight className="w-4 h-4 text-white" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {selectedProgram !== 'ALL' ? `Belum ada assessment untuk ${selectedProgram}` : 'Belum ada assessment'}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                {searchTerm
                                                    ? 'Tidak ada assessment yang sesuai dengan pencarian Anda.'
                                                    : selectedProgram !== 'ALL'
                                                        ? `Assessment untuk jurusan ${getProgramFullName(selectedProgram)} akan muncul di sini.`
                                                        : 'Assessment akan muncul di sini setelah Anda mendaftar.'
                                                }
                                            </p>
                                            {!searchTerm && selectedProgram === 'ALL' && (
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