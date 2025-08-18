import { ChevronLeft, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import NavbarAsesi from '@/components/NavbarAsesi';
import { Link } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';

export default function AsessementPilihanGanda() {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showModalConfirmSubmit, setShowModalConfirmSubmit] = useState(false);

    // ----- DATA STATIS -----
    type Option = { value: string; label: string };
    type Question = {
        id: string;
        number: number;
        question: string;
        options: Option[];
    };

    const asesi = "Ananda Keizha Oktavian";
    const asesor = "Eva Yeprilianti, S.Kom";
    const tanggal = "24 Oktober 2025";
    const waktu = "07:00 - 15:00";
    const skema = "Pemrogram Junior ( Junior Coder )";
    const kodeSkema = "SKM.RPL.PJ/LSPSMK24/2023";

    const sampleQuestions: Question[] = [
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

    // State jawaban
    const initialAnswers: Record<string, string> = {};
    sampleQuestions.forEach((q) => {
        initialAnswers[q.id] = '';
    });

    const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);

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

            // Simulasi submit sukses (tidak ada API)
            console.log("Jawaban tersimpan:", answers);

            setSuccess('Jawaban berhasil disimpan!');
            setTimeout(() => {
                window.history.back();
            }, 2000);
        } catch (error: any) {
            setError('Gagal menyimpan jawaban. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    // Hitung progress
    const totalQuestions = sampleQuestions.length;
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

                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        {/* Header Info */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                {/* Kiri */}
                                <div className="flex-1">
                                    <h2 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                        Skema Sertifikasi ( Okupasi )
                                        <span className="text-gray-400 text-xs flex items-center gap-1">
                                            <Clock size={14} />
                                            Sewaktu
                                        </span>
                                    </h2>
                                    {/* Mobile (tampil per baris) */}
                                    <div className="text-sm text-gray-500 mt-1 flex flex-col gap-1 sm:hidden">
                                        <div>
                                            Asesi: <span className="text-gray-800">{asesi}</span>
                                        </div>
                                        <div>
                                            Asesor: <span className="text-gray-800">{asesor}</span>
                                        </div>
                                        <div>
                                            {tanggal} | {waktu}
                                        </div>
                                    </div>

                                    {/* Desktop (tetap sejajar) */}
                                    <div className="text-sm text-gray-500 mt-1 hidden sm:block">
                                        Asesi: <span className="text-gray-800">{asesi}</span> &nbsp;|&nbsp;
                                        Asesor: <span className="text-gray-800">{asesor}</span> &nbsp;|&nbsp;
                                        {tanggal} | {waktu}
                                    </div>
                                </div>

                                {/* Kanan */}
                                <div className="flex-1 text-left sm:text-right">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                                        <p className="text-sm text-gray-800 font-medium">{skema}</p>
                                        <p className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded w-fit">
                                            {kodeSkema}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mt-2 w-full">
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            Assesmen awal: {answeredCount} / {totalQuestions}
                                        </span>
                                        <div className="flex-1 sm:w-28 bg-gray-200 rounded-full h-1.5">
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
                            {sampleQuestions.map((question) => (
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
                                    onClick={() => setShowModalConfirmSubmit(true)}
                                    disabled={submitting}
                                    className="w-full lg:w-auto bg-[#E77D35] hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white lg:px-20 py-2 rounded transition-colors cursor-pointer"
                                >
                                    {submitting ? 'Menyimpan...' : 'Kirim'}
                                </button>
                            </div>
                        </div>
                        {showModalConfirmSubmit && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-[999]">
                                <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full text-center">
                                    <div className="mb-4 flex justify-center">
                                        <img src="/img/confirm-submit.svg" alt="Pria Sigma" />
                                    </div>

                                    <h2 className="font-bold text-lg mb-2">Konfirmasi Pengiriman Jawaban</h2>
                                    <p className="text-gray-500 text-sm mb-10">
                                        Anda tidak dapat mengubah atau menambah jawaban. Pastikan seluruh soal telah dijawab dan diperiksa dengan cermat sebelum melanjutkan.
                                    </p>

                                    <div className="flex justify-between gap-2">
                                        <button
                                            onClick={() => setShowModalConfirmSubmit(false)}
                                            className="flex-1 border border-[#E77D35] text-[#E77D35] py-2 rounded hover:bg-orange-50 cursor-pointer"
                                        >
                                            Batalkan
                                        </button>
                                        <Link
                                            onClick={() => {
                                                setShowModalConfirmSubmit(false);
                                                handleSubmit(); // ⬅️ Jalankan submit
                                            }}
                                            to={paths.asesi.asesmenPilihanGanda}
                                            className="flex-1 bg-[#E77D35] text-white py-2 rounded hover:bg-orange-600 cursor-pointer text-center"
                                        >
                                            Lanjut
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}