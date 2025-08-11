import { ChevronDown, Clipboard } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import NavbarAsesor from '@/components/NavAsesor';

const FIIA01Page = () => {
  const [selectedKPekerjaan, setSelectedKPekerjaan] = useState('All unit (8)');
  const [recommendation, setRecommendation] = useState<'kompeten' | 'belum' | null>(null);
  
  // Dropdown states
  const [dropdownStates, setDropdownStates] = useState({
    namaAsesi: { isOpen: false, selected: '' },
    namaAsesor: { isOpen: false, selected: '' },
    pilihAsesi: { isOpen: false, selected: '' },
    pilihAsesor: { isOpen: false, selected: '' }
  });

  const dropdownOptions = {
    namaAsesi: ['John Doe', 'Jane Smith', 'Ahmad Rahman', 'Siti Nurhaliza', 'Budi Santoso'],
    namaAsesor: ['Dr. Budi Santoso', 'Prof. Siti Nurhaliza', 'Ir. Agus Wijaya', 'Dr. Ahmad Rahman'],
    pilihAsesi: ['John Doe', 'Jane Smith', 'Ahmad Rahman', 'Siti Nurhaliza', 'Budi Santoso'],
    pilihAsesor: ['Dr. Budi Santoso', 'Prof. Siti Nurhaliza', 'Ir. Agus Wijaya', 'Dr. Ahmad Rahman']
  };

  // Custom Dropdown Component - Simplified version like in second file
  const CustomDropdown = ({ 
    dropdownKey, 
    placeholder, 
    className = "",
    label = ""
  }: {
    dropdownKey: keyof typeof dropdownStates;
    placeholder: string;
    className?: string;
    label?: string;
  }) => {
    const { isOpen, selected } = dropdownStates[dropdownKey];
    const options = dropdownOptions[dropdownKey];

    const toggleDropdown = () => {
      setDropdownStates(prev => ({
        ...prev,
        [dropdownKey]: { ...prev[dropdownKey], isOpen: !prev[dropdownKey].isOpen }
      }));
    };

    const selectOption = (option: string) => {
      setDropdownStates(prev => ({
        ...prev,
        [dropdownKey]: { selected: option, isOpen: false }
      }));
    };

    return (
      <div className={`relative ${className}`}>
        {label && (
          <label className="block text-xs text-gray-500 mb-2 font-medium">{label}</label>
        )}
        <button
          type="button"
          onClick={toggleDropdown}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] transition-all duration-200 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            {selected ? (
              <span className="font-medium text-gray-900 text-sm truncate">{selected}</span>
            ) : (
              <span className="text-gray-500 text-sm">{placeholder}</span>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`} />
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectOption(option)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-[#E77D35]/10 hover:text-[#E77D35] transition-colors first:rounded-t-lg last:rounded-b-lg text-sm ${
                  selected === option ? 'bg-[#E77D35]/10 text-[#E77D35] font-medium' : 'text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Data dummy untuk unit kompetensi dengan pengelompokan K-Pekerjaan
  const unitData = [
    {
      id: 1,
      title: 'Menggunakan Struktur Data',
      code: 'J.620100.004.02',
      status: 'Finished',
      kPekerjaan: 1
    },
    {
      id: 2,
      title: 'Menggunakan Spesifikasi Program',
      code: 'J.620100.009.01',
      status: 'pending',
      kPekerjaan: 1
    },
    {
      id: 3,
      title: 'Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia',
      code: 'J.620100.010.01',
      status: 'pending',
      kPekerjaan: 1
    },
    {
      id: 4,
      title: 'Menulis Kode Dengan Prinsip Sesuai Guidelines dan Best Practices',
      code: 'J.620100.016.01',
      status: 'pending',
      kPekerjaan: 2
    },
    {
      id: 5,
      title: 'Mengimplementasikan Pemrograman Terstruktur',
      code: 'J.620100.023.02',
      status: 'pending',
      kPekerjaan: 2
    },
    {
      id: 6,
      title: 'Membuat Dokumen Kode Program',
      code: 'J.620100.025.02',
      status: 'pending',
      kPekerjaan: 2
    },
    {
      id: 7,
      title: 'Melakukan Debugging',
      code: 'J.620100.025.02',
      status: 'pending',
      kPekerjaan: 3
    },
    {
      id: 8,
      title: 'Melaksanakan Pengujian Unit Program',
      code: 'J.620100.033.02',
      status: 'pending',
      kPekerjaan: 3
    }
  ];

  // Filter data berdasarkan K-Pekerjaan yang dipilih
  const getFilteredData = () => {
    if (selectedKPekerjaan === 'All unit (8)') {
      return unitData;
    }
    const kPekerjaanNumber = parseInt(selectedKPekerjaan.split(' ')[1]);
    return unitData.filter(unit => unit.kPekerjaan === kPekerjaanNumber);
  };

  const filteredData = getFilteredData();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setDropdownStates(prev => {
          const newState = { ...prev };
          Object.keys(newState).forEach(key => {
            const typedKey = key as keyof typeof newState;
            newState[typedKey] = { ...newState[typedKey], isOpen: false };
          });
          return newState;
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar Header */}
      <NavbarAsesor 
        title="Ceklis Observasi Aktivitas di Tempat Kerja atau di Tempat Kerja Simulasi - F1-IA-01"
        icon={<Clipboard className="w-6 h-6" />}
      />

      {/* Filter Section Card - Responsive */}
      <div className="bg-white mx-4 lg:mx-6 mt-4 lg:mt-6 rounded-lg shadow-sm border p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h2 className="text-lg font-medium whitespace-nowrap">Skema Sertifikasi (Okupasi)</h2>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                <polyline points="12,6 12,12 16,14" strokeWidth="2"></polyline>
              </svg>
              <span className="text-sm text-gray-600">Sewaktu</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-sm text-gray-600">Pemrogram Junior ( Junior Coder )</span>
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm font-medium w-fit">
              SMK RPL PJ/SPSMK24/2023
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mt-6 lg:mt-8 gap-4 lg:gap-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="dropdown-container">
              <CustomDropdown 
                dropdownKey="namaAsesi"
                placeholder="Pilih Nama Asesi"
                className="sm:min-w-[200px]"
              />
            </div>
            <div className="dropdown-container">
              <CustomDropdown 
                dropdownKey="namaAsesor"
                placeholder="Pilih Nama Asesor"
                className="sm:min-w-[200px]"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="relative">
              <label className="block text-xs text-gray-500 mb-2 font-medium">Tanggal dimulai</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E77D35]/20 focus:border-[#E77D35] text-gray-700 sm:min-w-[160px]"
              />
            </div>
            
            <div className="relative">
              <label className="block text-xs text-gray-500 mb-2 font-medium">Tanggal selesai</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E77D35]/20 focus:border-[#E77D35] text-gray-700 sm:min-w-[160px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card - Responsive */}
      <div className="bg-white mx-4 lg:mx-6 mt-4 lg:mt-6 rounded-lg shadow-sm border p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {['All unit (8)', 'K-Pekerjaan 1', 'K-Pekerjaan 2', 'K-Pekerjaan 3'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setSelectedKPekerjaan(tab)}
                className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedKPekerjaan === tab 
                    ? 'bg-[#E77D35] text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {filteredData.map((unit, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#E77D35]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#E77D35]">Unit kompetensi {unit.id}</span>
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2 text-sm leading-tight">
                {unit.title}
              </h3>
              
              <p className="text-xs text-gray-500 mb-4">{unit.code}</p>
              
              <div className="flex items-center justify-between">
                {unit.status === 'Finished' ? (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                    Finished
                  </span>
                ) : (
                  <div></div>
                )}
                <button className="text-[#E77D35] text-xs font-medium hover:text-[#E77D35]/90 transition-colors">
                  Lihat detail →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Card - Responsive */}
      <div className="bg-white mx-4 lg:mx-6 mt-4 lg:mt-6 mb-6 rounded-lg shadow-sm border p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rekomendasi</h3>
            
            <div className="space-y-4 mb-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="recommendation"
                  checked={recommendation === 'kompeten'}
                  onChange={() => setRecommendation('kompeten')}
                  className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
                />
                <span className={`text-sm text-gray-700 leading-relaxed transition-all duration-300 ${
                  recommendation === 'belum' ? 'line-through opacity-50' : ''
                }`}>
                  Asesi telah memenuhi pencapaian seluruh kriteria unjuk kerja, direkomendasikan <strong>KOMPETEN</strong>
                </span>
              </label>
              
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="recommendation"
                  checked={recommendation === 'belum'}
                  onChange={() => setRecommendation('belum')}
                  className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
                />
                <span className={`text-sm text-gray-700 leading-relaxed transition-all duration-300 ${
                  recommendation === 'kompeten' ? 'line-through opacity-50' : ''
                }`}>
                  Asesi belum memenuhi pencapaian seluruh kriteria unjuk kerja, direkomendasikan <strong>BELUM KOMPETEN</strong>
                </span>
              </label>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Pada', width: 'w-full sm:w-48' },
                { label: 'Kelompok Pekerjaan', width: 'w-full sm:w-48' },
                { label: 'Unit', width: 'w-full sm:w-48' },
                { label: 'Elemen', width: 'w-full sm:w-48' },
                { label: 'KUK', width: 'w-full sm:w-48' }
              ].map((field, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="text-sm font-medium text-gray-700 sm:w-32 flex-shrink-0">{field.label}</label>
                  <span className="text-sm text-gray-700 hidden sm:block">:</span>
                  <input 
                    type="text" 
                    className={`${field.width} bg-transparent border-0 border-b border-gray-400 focus:border-[#E77D35] focus:outline-none pb-1 text-sm transition-colors`}
                    placeholder=""
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asesi</h3>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="dropdown-container flex-1">
                  <CustomDropdown 
                    dropdownKey="pilihAsesi"
                    placeholder="Pilih Asesi"
                  />
                </div>
                <div className="relative sm:w-40">
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E77D35]/20 focus:border-[#E77D35] text-gray-700"
                    placeholder="Pilih tanggal"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asesor</h3>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="dropdown-container flex-1">
                  <CustomDropdown 
                    dropdownKey="pilihAsesor"
                    placeholder="Pilih Asesor"
                  />
                </div>
                <div className="relative sm:w-40">
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E77D35]/20 focus:border-[#E77D35] text-gray-700"
                    placeholder="Pilih tanggal"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900 mb-2">No. Reg</h4>
                <input 
                  type="text" 
                  placeholder="Masukkan nomor reg"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E77D35]/20 focus:border-[#E77D35] placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            <button className="w-full bg-[#E77D35] text-white py-3 rounded-lg font-medium hover:bg-[#E77D35]/90 transition-all duration-200 shadow-sm hover:shadow-md">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FIIA01Page;