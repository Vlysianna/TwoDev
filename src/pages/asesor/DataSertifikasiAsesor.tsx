import React, { useState, useEffect } from 'react';
import { Upload, X, Eye, ChevronLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAsesor from '@/components/NavAsesor';
import paths from '@/routes/paths';
import api from '@/helper/axios';

interface LocalFileMeta {
    id: number;
    file?: File; // actual file
    name: string;
    format: string;
    size: string;
    field?: string; // mapping to backend field name (e.g. student_card)
    uploadedUrl?: string;
}

interface FileUploadAreaProps {
    title: string;
    files: LocalFileMeta[];
    onFileRemove: (fileId: number, type: string) => void;
    onFileAdd: (type: string, fileList: FileList | null) => void;
    type: string;
    uploading?: boolean;
}

export default function DataSertifikasiAsesor() {
    const [selectedAssessment, setSelectedAssessment] = useState('');
    const [selectedAssessor, setSelectedAssessor] = useState('');
    interface AssessorOption { id: number; user?: { full_name?: string } }
    const [assessors, setAssessors] = useState<AssessorOption[]>([]);
    const [administrativeFiles, setAdministrativeFiles] = useState<LocalFileMeta[]>([]);
    const [supportingFiles, setSupportingFiles] = useState<LocalFileMeta[]>([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [assessmentId, setAssessmentId] = useState<number | null>(null);
    const [assesseeId, setAssesseeId] = useState<number | null>(null); // integrate with previous step later
    const [assessments, setAssessments] = useState<{ id: number; code: string }[]>([]);

    // steps UI reserved (not rendered yet)

    const assessmentOptions = [
        'Sertifikasi',
        'Sertifikasi Ulang',
        'Pengakuan Kompetensi Terkini ( PKT )',
        'Rekognisi Pembelajaran Lampau',
        'Lainnya'
    ];

        const handleFileRemove = (fileId: number, type: string) => {
        if (type === 'administrative') {
                        setAdministrativeFiles(files => files.filter(file => file.id !== fileId));
        } else {
                        setSupportingFiles(files => files.filter(file => file.id !== fileId));
        }
    };

    const handleFileAdd = (type: string, fileList: FileList | null) => {
            if (!fileList || !fileList.length) return;
            const file = fileList[0];
            const meta: LocalFileMeta = {
                id: Date.now(),
                file,
                name: file.name,
                format: file.type.split('/')[1] || 'unknown',
                size: (file.size / 1024).toFixed(1) + 'KB',
        // default field left undefined so user can choose the document type
        };
            if (type === 'administrative') setAdministrativeFiles(prev => [...prev, meta]);
            else setSupportingFiles(prev => [...prev, meta]);
        };

            useEffect(() => {
                (async () => {
                    try {
                        const [assessorRes, assessmentRes] = await Promise.all([
                            api.get('/assessor'),
                            api.get('/assessments')
                        ]);
                        if (assessorRes.data.success) setAssessors(assessorRes.data.data);
                        if (assessmentRes.data.success) setAssessments(assessmentRes.data.data);
                        const storedAssessee = localStorage.getItem('assessee_id');
                        if (storedAssessee) setAssesseeId(Number(storedAssessee));
                    } catch (e) {
                        console.error('Gagal init data', e);
                    }
                })();
            }, []);

        const submitUploads = async () => {
                    if (!assessmentId) {
                        setError('Pilih assessment terlebih dahulu');
                        return;
                    }
                    if (!assesseeId) {
                        setError('Assessee belum tersedia. Lengkapi data sebelumnya.');
                        return;
                    }
                    if (!selectedAssessor) {
                        setError('Pilih asesor');
                return;
            }
            setUploading(true);
            setError(null);
            setMessage(null);
            try {
                const combined = [...administrativeFiles, ...supportingFiles];

                // ensure required student_card is present
                const hasStudentCard = combined.some(f => f.field === 'student_card' && f.file);
                if (!hasStudentCard) {
                    setError('Dokumen wajib "Kartu Pelajar (student_card)" belum dipilih/upload');
                    return;
                }

                // build FormData to send files using their assigned field keys
                const form = new FormData();
                form.append('assessment_id', String(assessmentId as number));
                form.append('assessee_id', String(assesseeId as number));
                form.append('assessor_id', String(Number(selectedAssessor)));
                form.append('purpose', selectedAssessment || 'APL1');

                combined.forEach(f => {
                    if (f.field && f.file instanceof File) {
                        form.append(f.field, f.file);
                    }
                });

                console.debug('Uploading APL1 certificate FormData:', combined.map(f => ({ name: f.name, field: f.field })));
                const res = await api.post('/assessments/apl-01/create-certificate-docs', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                console.debug('Upload response:', res?.data);
                if (res?.data?.success) {
                    setMessage('Upload berhasil');
                } else setError(res?.data?.message || 'Upload gagal');
                    } catch (e) {
                        const err = e as { response?: { data?: { message?: string } } };
                        setError(err.response?.data?.message || 'Upload gagal');
            } finally {
                setUploading(false);
            }
        };

    const FileUploadArea: React.FC<FileUploadAreaProps> = ({ title, files, onFileRemove, onFileAdd, type, uploading }) => (
        <div className="bg-white rounded-lg">
            <h3 className="text-gray-900 font-medium mb-4">{title}</h3>

            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 mb-4 hover:cursor-pointer transition-colors hover:bg-gray-100 block">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-800 text-xl mb-2">Pilih file atau drag & drop</p>
                <p className="text-gray-500 text-[12px] mb-4">PNG, JPG, PDF (max 10MB)</p>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 inline-block">Browse File</span>
                <input type="file" className="hidden" onChange={e => onFileAdd(type, e.target.files)} />
            </label>

            <div className="border border-gray-200 rounded-lg p-3 h-50 overflow-y-auto"> {/* Fixed height with scroll */}
                {files.length > 0 ? (
                    <div className="space-y-3">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 hover:cursor-pointer transition-colors"
                            >
                                {/* Kiri - Icon + Detail */}
                                <div className="flex items-center space-x-3 min-w-0">
                                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Upload className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-gray-900 font-medium text-sm truncate">{file.name}</p>
                                        <p className="text-gray-500 text-xs truncate">Format: {file.format} • Ukuran: {file.size}</p>
                                    </div>
                                </div>

                                {/* Kanan - Tombol + field selector */}
                                <div className="flex items-center space-x-2">
                                    <select
                                        value={file.field || ''}
                                        onChange={(e) => {
                                            const f = e.target.value || undefined;
                                            // update file.field in parent arrays
                                            if (type === 'administrative') {
                                                setAdministrativeFiles(prev => prev.map(p => p.id === file.id ? { ...p, field: f } : p));
                                            } else {
                                                setSupportingFiles(prev => prev.map(p => p.id === file.id ? { ...p, field: f } : p));
                                            }
                                        }}
                                        className="px-2 py-1 border rounded text-sm mr-2"
                                    >
                                        <option value="">Pilih tipe dokumen</option>
                                        <option value="school_report_card">Raport</option>
                                        <option value="field_work_practice_certificate">SKP</option>
                                        <option value="student_card">Kartu Pelajar</option>
                                        <option value="family_card">Kartu Keluarga</option>
                                        <option value="id_card">KTP</option>
                                    </select>
                                    <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                                        <Eye className="w-4 h-4 text-gray-600" />
                                    </button>
                                                                        {!uploading && (
                                                                            <button
                                                                                    onClick={() => onFileRemove(file.id, type)}
                                                                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                                                                            >
                                                                                    <X className="w-4 h-4 text-gray-600" />
                                                                            </button>
                                                                        )}
                                </div>
                            </div>

                        ))}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        No files uploaded yet
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesor
                        title='Bukti Administratif'
                        icon={
                            <Link to={paths.asesor.apl01} className="text-gray-500 hover:text-gray-600">
                                <ChevronLeft size={20} />
                            </Link>
                        }
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-6 pb-7 flex">
                    {/* Left Column */}
                    <div className="space-y-6 md:col-span-3 flex flex-col">
                        {/* Tujuan Assessment */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h3 className="text-gray-900 font-medium mb-4">Tujuan Assessment</h3>
                            <div className="space-y-3">
                                {assessmentOptions.map((option) => (
                                    <label key={option} className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="assessment"
                                            value={option}
                                            checked={selectedAssessment === option}
                                            onChange={(e) => setSelectedAssessment(e.target.value)}
                                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                                        />
                                        <span className="text-gray-700 text-sm">{option}</span>
                                    </label>
                                ))}
                            </div>
                                                        <h3 className="text-gray-900 font-medium mt-4 mb-2">Pilih Assessment</h3>
                                                        <div className="relative">
                                                            <select
                                                                value={assessmentId ?? ''}
                                                                onChange={e => setAssessmentId(e.target.value ? Number(e.target.value) : null)}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                                                            >
                                                                <option value="">Pilih assessment</option>
                                                                {assessments.map(a => (
                                                                    <option key={a.id} value={a.id}>{a.code}</option>
                                                                ))}
                                                            </select>
                                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-gray-900 font-medium mt-4 mb-2">Pilih Asesor</h3>
                            <div className="relative">
                                                                <select
                                                                    value={selectedAssessor}
                                                                    onChange={(e) => setSelectedAssessor(e.target.value)}
                                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                                                                >
                                                                    <option value="">Pilih nama asesor</option>
                                                                    {assessors.map(a => (
                                                                        <option key={a.id} value={a.id}>{a.user?.full_name || `Asesor ${a.id}`}</option>
                                                                    ))}
                                                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-gray-900 font-medium mb-4">Kelengkapan Bukti Administratif</h3>
                            <div className="space-y-3">
                                                                <FileUploadArea
                                                                    title=""
                                                                    files={administrativeFiles}
                                                                    onFileRemove={handleFileRemove}
                                                                    onFileAdd={handleFileAdd}
                                                                    type="administrative"
                                                                    uploading={uploading}
                                                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='md:col-span-2 flex flex-col space-y-6'>
                        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
                            <h3 className="text-gray-900 font-medium mb-4">Kelengkapan Pemohon</h3>
                            <div className="space-y-3 flex-grow">
                                                                <FileUploadArea
                                                                    title=""
                                                                    files={supportingFiles}
                                                                    onFileRemove={handleFileRemove}
                                                                    onFileAdd={handleFileAdd}
                                                                    type="supporting"
                                                                    uploading={uploading}
                                                                />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:px-6 sm:py-4 flex flex-col h-full w-full mx-auto">
                            <div className="text-center mt-4 mb-4 space-y-3">
                                <textarea
                                    name="catatan"
                                    value=""
                                    placeholder="Catatan"
                                    rows={3}
                                    className="w-full px-3 py-3 border border-[#DADADA] rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       text-sm sm:text-base resize-none"
                                />
                                <hr className="border-gray-300" />
                                                                {error && <p className="text-sm text-red-600">{error}</p>}
                                                                {message && <p className="text-sm text-green-600">{message}</p>}
                                                                <div className="w-full space-y-2">
                                                                    <button
                                                                        onClick={submitUploads}
                                                                        disabled={uploading}
                                                                        className="w-full flex items-center justify-center gap-2 bg-[#E77D35] hover:bg-orange-600 disabled:opacity-60 text-white font-normal py-2 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
                                                                    >
                                                                        {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                                                        {uploading ? 'Mengupload...' : 'Upload & Lanjut'}
                                                                    </button>
                                                                    <Link
                                                                        to={paths.asesor.asesmenMandiri}
                                                                        className="block text-center text-sm text-gray-600 underline"
                                                                    >Lewati</Link>
                                                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}