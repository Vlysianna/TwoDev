import React, { useState } from 'react';
import { Upload, X, Eye } from 'lucide-react';
import NavbarAsesi from '../../components/NavbarAsesi';

interface File {
    id: number;
    name: string;
    format: string;
    size: string;
}

interface FileUploadAreaProps {
    title: string;
    files: File[];
    onFileRemove: (fileId: number, type: string) => void;
    type: string;
}

export default function LspMediaForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedAssessment, setSelectedAssessment] = useState('');
    const [selectedAssessor, setSelectedAssessor] = useState('');
    const [administrativeFiles, setAdministrativeFiles] = useState<File[]>([
        {
            id: 1,
            name: 'Pas foto 3x4 latar belakang merah',
            format: 'PNG',
            size: '2MB'
        },
        {
            id: 2,
            name: 'Kartu Tanda Penduduk ( KTP ) / Kartu Keluarga ( KK )',
            format: 'PNG',
            size: '5MB'
        }
    ]);
    const [supportingFiles, setSupportingFiles] = useState<File[]>([
        {
            id: 1,
            name: 'Sertifikat berbasis kompetensi',
            format: 'PNG',
            size: '2MB'
        },
        {
            id: 2,
            name: 'Fotocopy ijazah terakhir',
            format: 'PNG',
            size: '2MB'
        },
        {
            id: 3,
            name: 'Report semester 1 - 5',
            format: 'PNG',
            size: '3MB'
        },
        {
            id: 4,
            name: 'Fotocopy Surat keterangan pengalaman kerja minimal 1 tahun',
            format: 'PNG',
            size: '3MB'
        }
    ]);

    const steps = [
        { number: 1, title: 'LSP Media', active: currentStep === 1, completed: currentStep > 1 },
        { number: 2, title: 'LSP Media', active: currentStep === 2, completed: currentStep > 2 },
        { number: 3, title: 'Tanda Tangan', active: currentStep === 3, completed: false }
    ];

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

    const FileUploadArea: React.FC<FileUploadAreaProps> = ({ title, files, onFileRemove, type }) => (
        <div className="bg-white rounded-lg">
            <h3 className="text-gray-900 font-medium mb-4">{title}</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 mb-4">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                <p className="text-gray-500 text-sm mb-4">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-colors">
                    Browse File
                </button>
            </div>

            {files.length > 0 && (
                <div className="space-y-3 max-h-64 overflow-y-auto"> {/* Tambahkan max-height dan overflow-y-auto */}
                    {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium text-sm">{file.name}</p>
                                    <p className="text-gray-500 text-xs">File Format: {file.format} • File Size: {file.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <Eye className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => onFileRemove(file.id, type)}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="max-h-screen bg-gray-50 py-18">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesi title='Bukti Administratif' />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-6 pb-7">
                    {/* Left Column */}
                    <div className="space-y-6 md:col-span-3">
                        {/* Tujuan Assessment */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                            <h3 className="text-gray-900 font-medium mt-4 mb-2">Pilih Asesor</h3>
                            <div className="relative">
                                <select
                                    value={selectedAssessor}
                                    onChange={(e) => setSelectedAssessor(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                                >
                                    <option value="">Pilih nama asesor</option>
                                    <option value="asesor1">Asesor 1</option>
                                    <option value="asesor2">Asesor 2</option>
                                    <option value="asesor3">Asesor 3</option>
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
                                    type="administrative"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='md:col-span-2 h-210'>
                        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 h-full">
                            <h3 className="text-gray-900 font-medium mb-4">Kelengkapan Pemohon</h3>
                            <div className="space-y-3">
                                <FileUploadArea
                                    title=""
                                    files={supportingFiles}
                                    onFileRemove={handleFileRemove}
                                    type="supporting"
                                />
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center h-auto">
                                <button className="px-16 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors bottom-0">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}