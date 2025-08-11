import { ChevronLeft, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import NavbarAsesi from '@/components/NavbarAsesi';
import { Link } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';

export default function AsessementPilihanGanda() {
    const { user } = useAuth();
    const [assessmentId, setAssessmentId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    useEffect(() => {
        // Try to get assessment ID from URL params or use default
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('assessmentId');
        const assessmentIdToUse = id ? parseInt(id) : 1; // Default to 1 if no ID provided
        
        setAssessmentId(assessmentIdToUse);
        fetchQuestions(assessmentIdToUse);
    }, []);

    const fetchQuestions = async (id: number) => {
        try {
            setLoading(true);
            const response = await api.get(`/questions/assessment/${id}`);
            
            if (response.data.success) {
                setQuestions(response.data.data);
                // Initialize answers state
                const initialAnswers: Record<string, string> = {};
                response.data.data.forEach((q: any, index: number) => {
                    initialAnswers[`soal${index + 1}`] = '';
                });
                setAnswers(initialAnswers);
            } else {
                // Fallback to sample questions if no API data
                setQuestions(sampleQuestions);
                const initialAnswers: Record<string, string> = {};
                sampleQuestions.forEach((q: any, index: number) => {
                    initialAnswers[`soal${index + 1}`] = '';
                });
                setAnswers(initialAnswers);
            }
        } catch (error: any) {
            console.log('Using sample questions due to API error:', error);
            setQuestions(sampleQuestions);
            const initialAnswers: Record<string, string> = {};
            sampleQuestions.forEach((q: any, index: number) => {
                initialAnswers[`soal${index + 1}`] = '';
            });
            setAnswers(initialAnswers);
        } finally {
            setLoading(false);
        }
    };

    const sampleQuestions = [
        {
            id: 'soal1',
            number: 1,
            question: 'Bahasa pemrograman yang umum digunakan untuk membuat aplikasi Android adalah...',
            options: [
                { value: 'python', label: 'Python' },
                { value: 'java', label: 'Java' },
                { value: 'c++', label: 'C++' },
                { value: 'php', label: 'PHP' }
            ]
        },
        {
            id: 'soal2',
            number: 2,
            question: 'Dalam model SDLC, tahap awal yang dilakukan untuk mengumpulkan informasi kebutuhan pengguna adalah...',
            options: [
                { value: 'implementasi', label: 'Implementasi' },
                { value: 'analisis', label: 'Analisis' },
                { value: 'desain', label: 'Desain' },
                { value: 'pemeliharaan', label: 'Pemeliharaan' }
            ]
        },
        {
            id: 'soal3',
            number: 3,
            question: 'Fungsi utama CSS dalam pembuatan website adalah...',
            options: [
                { value: 'struktur', label: 'Mengatur struktur halaman' },
                { value: 'data', label: 'Menyimpan data pengguna' },
                { value: 'tampilan', label: 'Mengatur tampilan dan gaya halaman' },
                { value: 'logika', label: 'Mengatur alur logika program' }
            ]
        },
        {
            id: 'soal4',
            number: 4,
            question: 'Istilah "database" mengacu pada...',
            options: [
                { value: 'desain', label: 'Program untuk membuat desain' },
                { value: 'data_terorganisir', label: 'Kumpulan data yang terorganisir' },
                { value: 'bahasa', label: 'Bahasa pemrograman' },
                { value: 'hardware', label: 'Perangkat keras penyimpanan' }
            ]
        },
        {
            id: 'soal5',
            number: 5,
            question: 'Perintah SQL DELETE FROM siswa WHERE id=1; digunakan untuk...',
            options: [
                { value: 'hapus_tabel', label: 'Menghapus tabel siswa' },
                { value: 'hapus_semua', label: 'Menghapus semua data siswa' },
                { value: 'hapus_id1', label: 'Menghapus data siswa dengan id=1' },
                { value: 'hapus_kolom', label: 'Menghapus kolom id dari tabel siswa' }
            ]
        },
        {
            id: 'soal6',
            number: 6,
            question: 'HTML termasuk ke dalam jenis bahasa...',
            options: [
                { value: 'pemrograman', label: 'Pemrograman' },
                { value: 'markup', label: 'Markup' },
                { value: 'skrip', label: 'Skrip' },
                { value: 'query', label: 'Query' }
            ]
        },
        {
            id: 'soal7',
            number: 7,
            question: 'Bootstrap adalah...',
            options: [
                { value: 'css', label: 'Framework CSS' },
                { value: 'dbms', label: 'Database Management System' },
                { value: 'bahasa', label: 'Bahasa Pemrograman' },
                { value: 'text_editor', label: 'Text Editor' }
            ]
        },
        {
            id: 'soal8',
            number: 8,
            question: 'Dalam OOP (Object-Oriented Programming), "class" berfungsi sebagai...',
            options: [
                { value: 'temp_data', label: 'Tempat menyimpan data sementara' },
                { value: 'blueprint', label: 'Cetak biru (blueprint) untuk membuat objek' },
                { value: 'fungsi_utama', label: 'Fungsi utama dalam program' },
                { value: 'ulang_kode', label: 'Perintah untuk mengulang kode' }
            ]
        },
        {
            id: 'soal9',
            number: 9,
            question: 'Salah satu metode pengujian perangkat lunak yang memeriksa fungsi aplikasi tanpa melihat kode sumber adalah...',
            options: [
                { value: 'white_box', label: 'White Box Testing' },
                { value: 'black_box', label: 'Black Box Testing' },
                { value: 'unit', label: 'Unit Testing' },
                { value: 'integration', label: 'Integration Testing' }
            ]
        },
        {
            id: 'soal10',
            number: 10,
            question: 'Git digunakan untuk...',
            options: [
                { value: 'desain_ui', label: 'Mengatur desain antarmuka' },
                { value: 'versi_kode', label: 'Mengelola versi kode program' },
                { value: 'keamanan', label: 'Menguji keamanan aplikasi' },
                { value: 'data_server', label: 'Menyimpan data di server' }
            ]
        }
    ];


    type Answers = {
        [key: string]: string;
    };


    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            setError(null);

            // Convert answers to API format
            const submissionData = {
                assessee_id: user?.id, // You might need to get assessee ID from user
                answers: Object.entries(answers).map(([key, value], index) => ({
                    question_id: questions[index]?.id || index + 1,
                    answer: value
                })).filter(item => item.answer) // Only submit answered questions
            };

            const response = await api.post('/questions/submit-answers', submissionData);

            if (response.data.success) {
                setSuccess('Jawaban berhasil disimpan!');
                setTimeout(() => {
                    // Navigate to next step or results page
                    window.history.back();
                }, 2000);
            }
        } catch (error: any) {
            setError('Gagal menyimpan jawaban. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    // Hitung progress
    const totalQuestions = questions.length;
    const answeredCount = Object.values(answers).filter(ans => ans !== '').length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesi
                        title='Lembar Jawaban Pilihan Ganda'
                        icon={
                            <Link to={paths.asesi.dataSertifikasi} className="text-gray-500 hover:text-gray-600">
                                <ChevronLeft size={20} />
                            </Link>
                        }
                    />
                </div>

                {/* Content */}
                <div className="px-4 sm:px-6 pb-7">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                            <span className="text-red-800">{error}</span>
                        </div>
                    )}

                    {/* Success State */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                            <span className="text-green-800">{success}</span>
                        </div>
                    )}

                    {!loading && (
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        {/* Header Info */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-4 gap-4">
                                {/* Kiri */}
                                <div>
                                    <h2 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                        Skema Sertifikasi ( Okupasi )
                                        <span className="text-gray-400 text-xs flex items-center gap-1">
                                            <Clock size={14} />
                                            Sewaktu
                                        </span>
                                    </h2>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Asesi: <span className="text-gray-800">Ananda Keizha Oktavian</span> &nbsp;|&nbsp;
                                        Asesor: <span className="text-gray-800">Eva Yeprilianti, S.Kom</span> &nbsp;|&nbsp;
                                        24 Oktober 2025 | 07:00 - 15:00
                                    </div>
                                </div>

                                {/* Kanan */}
                                <div className="text-left lg:text-right">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <p className="text-sm text-gray-800 font-medium">
                                            Pemrogram Junior ( Junior Coder )
                                        </p>
                                        <p className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded w-fit">
                                            SKM.RPL.PJ/LSPSMK24/2023
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-gray-500">
                                            Assesmen awal: {answeredCount} / {totalQuestions}
                                        </span>
                                        <div className="w-28 bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-orange-400 h-1.5 rounded-full transition-all"
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{progressPercent}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="space-y-8">
                            {questions.map((question) => (
                                <div key={question.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                                    <h3 className="font-semibold text-gray-800 mb-4">
                                        Soal {question.number}
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        {question.question}
                                    </p>
                                    <div className="border border-gray-200 rounded-lg p-4 w-full md:w-[40rem]">
                                        <div className="space-y-3">
                                            {question.options.map((option) => (
                                                <label key={option.value} className="flex items-center cursor-pointer">
                                                    <div className="relative">
                                                        <input
                                                            type="radio"
                                                            name={question.id}
                                                            value={option.value}
                                                            checked={answers[question.id] === option.value}
                                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[question.id] === option.value
                                                            ? 'border-orange-500 bg-orange-500'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {answers[question.id] === option.value && (
                                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className={`ml-3 text-sm px-3 py-2 rounded flex-1 ${answers[question.id] === option.value
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                        }`}>
                                                        {option.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex justify-end">
                                <button 
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    {submitting ? 'Menyimpan...' : 'Simpan Jawaban'}
                                </button>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}
