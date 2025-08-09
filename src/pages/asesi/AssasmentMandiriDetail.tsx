import React, { useState } from 'react';
import { Monitor, ChevronLeft, Search } from 'lucide-react';
import NavbarAsesi from '@/components/NavbarAsesi';
import { Link } from 'react-router-dom';

export default function AssessmentMandiriDetail() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterKompeten, setFilterKompeten] = useState('all');
    const [selectedProof, setSelectedProof] = useState<{ [key: number]: string | undefined }>({});
    const [pencapaian, setPencapaian] = useState<{ [key: number]: string | undefined }>({});
    const [globalProof, setGlobalProof] = useState(''); // dropdown header


    const assessmentData = [
        {
            id: 1,
            elemen: "Menggunakan metode pengembangan program",
            criteria: [
                { id: "1.1", text: "Mendefinisikan Metode pengembangan aplikasi (software development)" },
                { id: "1.2", text: "Memilih Metode pengembangan aplikasi (software development) sesuai kebutuhan" }
            ]
        },
        {
            id: 2,
            elemen: "Menggunakan diagram program dan deskripsi program",
            criteria: [
                { id: "2.1", text: "Mendefinisikan Diagram program dengan metodologi pengembangan sistem" },
                { id: "2.2", text: "Menggunakan Metode pemodelan, diagram objek dan diagram komponen digunakan pada implementasi program sesuai dengan spesifikasi" }
            ]
        },
        {
            id: 3,
            elemen: "Menerapkan hasil pemodelan ke dalam pengembangan program pengembangan program",
            criteria: [
                { id: "3.1", text: "Memilih Hasil pemodelan yang mendukung kemampuan metodologi sesuai spesifikasi." },
                { id: "3.2", text: "Memilih Hasil pemrograman (Integrated Development Environment-IDE) yang mendukung kemampuan metodologi bahasa pemrograman sesuai spesifikasi" }
            ]
        }
    ];

    const handleProofSelection = (criteriaId: number, value: string) => {
        setSelectedProof(prev => ({
            ...prev,
            [criteriaId]: value
        }));
    };

    const handlePencapaianChange = (id: number, value: string) => {
        setPencapaian(prev => ({
            ...prev,
            [id]: value
        }));
    };


    const handleFilterChange = (value: string) => {
        setFilterKompeten(value);

        if (value === 'kompeten' || value === 'belum') {
            const newPencapaian: { [key: number]: string } = {};
            assessmentData.forEach(item => {
                newPencapaian[item.id] = value;
            });
            setPencapaian(newPencapaian);
        }
    };


    const handleGlobalProofChange = (value: string) => {
        setGlobalProof(value);

        const newProof: { [key: number]: string } = {};
        assessmentData.forEach(item => {
            newProof[item.id] = value;
        });

        setSelectedProof(newProof);
    };

    const filteredData = assessmentData.filter(item => {
        const matchesSearch = item.elemen.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.criteria.some(criteria => criteria.text.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesi
                        title='Detail'
                        icon={
                            <Link to="/data-sertifikasi" className="text-gray-500 hover:text-gray-600">
                                <ChevronLeft size={20} />
                            </Link>
                        }
                    />
                </div>

                <div className="bg-white rounded-lg shadow-sm m-10 px-5 py-7">
                    {/* Header */}
                    <div className="pb-7">
                        <div className="flex flex-wrap items-center w-full gap-4 md:gap-6">
                            {/* Unit Kompetensi */}
                            <div className="flex items-center gap-2 text-[#00809D] flex-none">
                                <Monitor size={20} />
                                <span className="font-medium">Unit kompetensi 1</span>
                            </div>

                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px]">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Filter Kompeten */}
                            <div className="flex flex-wrap items-center gap-3 md:gap-6 flex-none">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="kompeten"
                                        checked={filterKompeten === 'kompeten'}
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                    />
                                    <span className="text-sm">Semua Kompeten</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="belum"
                                        checked={filterKompeten === 'belum'}
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                    />
                                    <span className="text-sm">Semua Belum Kompeten</span>
                                </label>
                            </div>

                            {/* Global Bukti Relevan */}
                            <div className="flex items-center gap-2 flex-none w-full md:w-80">
                                <select
                                    className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500 hover:cursor-pointer"
                                    value={globalProof}
                                    onChange={(e) => handleGlobalProofChange(e.target.value)}
                                >
                                    <option value="">Bukti Relevan</option>
                                    <option value="dokumen1">Dokumen 1</option>
                                    <option value="dokumen2">Dokumen 2</option>
                                    <option value="dokumen3">Dokumen 3</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border border-gray-200 rounded-sm">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 sm:p-7 text-left text-sm font-medium text-gray-700 w-64">
                                        Elemen
                                    </th>
                                    <th className="p-3 sm:p-7 text-left text-sm font-medium text-gray-700 w-64">
                                        Kriteria Untuk Kerja
                                    </th>
                                    <th className="p-3 sm:p-7 text-center text-sm font-medium text-gray-700 w-40">
                                        Pencapaian
                                    </th>
                                    <th className="p-3 sm:p-7 text-center text-sm font-medium text-gray-700 w-40">
                                        Bukti yang relevan
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item) => (
                                    <React.Fragment key={item.id}>
                                        {item.criteria.map((criteria, criteriaIndex) => (
                                            <tr
                                                key={criteria.id}
                                                className={`${criteriaIndex === 0 ? 'border-t border-gray-300' : ''}`}
                                            >
                                                {criteriaIndex === 0 && (
                                                    <td
                                                        className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900 align-top"
                                                        rowSpan={item.criteria.length}
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <span className="font-medium">{item.id}</span>
                                                            <span>{item.elemen}</span>
                                                        </div>
                                                    </td>
                                                )}

                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900">
                                                    <div className="flex items-start gap-2">
                                                        <span className="font-medium text-blue-600 min-w-8">
                                                            {criteria.id}
                                                        </span>
                                                        <span>{criteria.text}</span>
                                                    </div>
                                                </td>

                                                {criteriaIndex === 0 && (
                                                    <td
                                                        className="px-2 sm:px-4 py-2 sm:py-3 text-center"
                                                        rowSpan={item.criteria.length}
                                                    >
                                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                                                            <label className="flex items-center gap-1 text-sm">
                                                                <input
                                                                    type="radio"
                                                                    name={`pencapaian-${item.id}`}
                                                                    value="kompeten"
                                                                    checked={pencapaian[item.id] === 'kompeten'}
                                                                    onChange={(e) =>
                                                                        handlePencapaianChange(item.id, e.target.value)
                                                                    }
                                                                />
                                                                Kompeten
                                                            </label>
                                                            <label className="flex items-center gap-1 text-sm">
                                                                <input
                                                                    type="radio"
                                                                    name={`pencapaian-${item.id}`}
                                                                    value="belum"
                                                                    checked={pencapaian[item.id] === 'belum'}
                                                                    onChange={(e) =>
                                                                        handlePencapaianChange(item.id, e.target.value)
                                                                    }
                                                                />
                                                                Belum Kompeten
                                                            </label>
                                                        </div>
                                                    </td>
                                                )}

                                                {criteriaIndex === 0 && (
                                                    <td
                                                        className="px-2 sm:px-4 py-2 sm:py-3 text-center"
                                                        rowSpan={item.criteria.length}
                                                    >
                                                        <select
                                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                                            value={selectedProof[item.id] || ''}
                                                            onChange={(e) =>
                                                                handleProofSelection(item.id, e.target.value)
                                                            }
                                                        >
                                                            <option value="">Bukti relevan</option>
                                                            <option value="dokumen1">Dokumen 1</option>
                                                            <option value="dokumen2">Dokumen 2</option>
                                                            <option value="dokumen3">Dokumen 3</option>
                                                        </select>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}