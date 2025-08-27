import { ChevronDown, Clipboard, ArrowLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import NavbarAsesor from '@/components/NavAsesor';

const Ia01 = () => {
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
        icon={<ArrowLeft size={20} />}
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
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm text-gray-500">
              <span className="font-bold">Asesi:</span> Ananda Keizha Oktavian
            </span>
            <span className="text-sm text-gray-500">
              <span className="font-bold">Asesor:</span> Eva Yeprilaini, S.Kom
            </span>
          </div>
          
          <span className="text-sm text-gray-500">
            24 Oktober 2025 | 07:00 - 15:00 - 24 Oktober 2025 | 07:00 - 15:00
          </span>
        </div>
      </div>

      {/* Main Content Card - Responsive */}
      <div className="bg-white mx-4 lg:mx-6 mt-4 lg:mt-6 rounded-lg shadow-sm border p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
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
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center justify-between w-full min-w-[520px]">
              <span className="text-sm text-gray-600">Completion</span>
              <span className="text-sm font-medium text-gray-900">100%</span>
            </div>
            <div className="w-full">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#E77D35] h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_0.8fr] gap-6 lg:gap-8 items-start">
          {/* Left Column - Rekomendasi */}
          <div className="lg:col-span-1 h-full flex flex-col">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Rekomendasi</h3>
            
            <div className="space-y-3 mb-6">
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

            {/* Form Fields in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
              {[
                { label: 'Pada', placeholder: 'Masukkan kata' },
                { label: 'Kelompok Pekerjaan', placeholder: 'Masukkan Kelompok Pekerjaan' },
                { label: 'Unit', placeholder: 'Masukkan unit' },
                { label: 'Elemen', placeholder: 'Masukkan elemen' },
                { label: 'KUK', placeholder: 'Masukkan KUK', fullWidth: true }
              ].map((field, index) => (
                <div key={index} className={field.fullWidth ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                  <input 
                    type="text" 
                    placeholder={field.placeholder}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E77D35]/20 focus:border-[#E77D35] placeholder-gray-400 transition-all"
                  />
                </div>
              ))}
            </div>
            
            {/* Spacer to push content to bottom alignment */}
            <div className="flex-grow"></div>
          </div>

          {/* Middle Column - Asesi & Asesor */}
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asesi</h3>
              
              <div className="mb-3">
                <input 
                  type="text" 
                  value="Ananda Keizha Oktavian"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                  readOnly
                />
              </div>
              
              <div className="relative">
                <input 
                  type="text" 
                  value="24 Oktober 2025"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
                  readOnly
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"></line>
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"></line>
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"></line>
                </svg>
              </div>
            </div>

            <div className="mb-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asesor</h3>
              
              <div className="mb-3">
                <input 
                  type="text" 
                  value="Eva Yeprilaini, S.Kom"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                  readOnly
                />
              </div>
              
              <div className="mb-3">
                <input 
                  type="text" 
                  value="24102026"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                  readOnly
                />
              </div>
              
              <div className="relative">
                <input 
                  type="text" 
                  value="24 Oktober 2025"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
                  readOnly
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"></line>
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"></line>
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"></line>
                </svg>
              </div>
            </div>
            
            {/* Spacer to align bottom */}
            <div className="flex-grow"></div>
          </div>

          {/* Right Column - QR Code */}
          <div className="px-2 h-full flex flex-col">
            <div className="space-y-4 flex-grow flex flex-col justify-between">
              {/* Existing QR Code */}
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded border flex items-center justify-center">
                  <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
                    {/* QR Code pattern */}
                    <rect x="0" y="0" width="100" height="100" fill="white"/>
                    <rect x="0" y="0" width="30" height="30" fill="black"/>
                    <rect x="5" y="5" width="20" height="20" fill="white"/>
                    <rect x="10" y="10" width="10" height="10" fill="black"/>
                    <rect x="70" y="0" width="30" height="30" fill="black"/>
                    <rect x="75" y="5" width="20" height="20" fill="white"/>
                    <rect x="80" y="10" width="10" height="10" fill="black"/>
                    <rect x="0" y="70" width="30" height="30" fill="black"/>
                    <rect x="5" y="75" width="20" height="20" fill="white"/>
                    <rect x="10" y="80" width="10" height="10" fill="black"/>
                    <rect x="40" y="10" width="5" height="5" fill="black"/>
                    <rect x="50" y="10" width="5" height="5" fill="black"/>
                    <rect x="60" y="10" width="5" height="5" fill="black"/>
                    <rect x="40" y="20" width="5" height="5" fill="black"/>
                    <rect x="60" y="20" width="5" height="5" fill="black"/>
                    <rect x="40" y="30" width="5" height="5" fill="black"/>
                    <rect x="50" y="30" width="5" height="5" fill="black"/>
                    <rect x="40" y="40" width="5" height="5" fill="black"/>
                    <rect x="60" y="40" width="5" height="5" fill="black"/>
                    <rect x="70" y="40" width="5" height="5" fill="black"/>
                    <rect x="80" y="40" width="5" height="5" fill="black"/>
                    <rect x="90" y="40" width="5" height="5" fill="black"/>
                    <rect x="40" y="50" width="5" height="5" fill="black"/>
                    <rect x="50" y="50" width="5" height="5" fill="black"/>
                    <rect x="70" y="50" width="5" height="5" fill="black"/>
                    <rect x="90" y="50" width="5" height="5" fill="black"/>
                    <rect x="40" y="60" width="5" height="5" fill="black"/>
                    <rect x="60" y="60" width="5" height="5" fill="black"/>
                    <rect x="80" y="60" width="5" height="5" fill="black"/>
                    <rect x="40" y="80" width="5" height="5" fill="black"/>
                    <rect x="50" y="80" width="5" height="5" fill="black"/>
                    <rect x="60" y="80" width="5" height="5" fill="black"/>
                    <rect x="70" y="80" width="5" height="5" fill="black"/>
                    <rect x="80" y="80" width="5" height="5" fill="black"/>
                    <rect x="90" y="80" width="5" height="5" fill="black"/>
                    <rect x="40" y="90" width="5" height="5" fill="black"/>
                    <rect x="60" y="90" width="5" height="5" fill="black"/>
                    <rect x="80" y="90" width="5" height="5" fill="black"/>
                  </svg>
                </div>
              </div>
              
              {/* Empty QR Code placeholder */}
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-32">
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  <p className="text-sm text-gray-500">QR Code akan muncul di sini</p>
                </div>
              </div>
              
              {/* Generate QR Button */}
              <button className="w-full bg-[#E77D35] text-white py-2 rounded-lg font-medium hover:bg-[#E77D35]/90 transition-all duration-200 shadow-sm hover:shadow-md text-sm">
                Generate QR
              </button>
              
              {/* Spacer to align bottom */}
              <div className="flex-grow-0"></div>
            </div>
          </div>
        </div>
        
        {/* Lanjut Button at the bottom */}
        <div className="mt-8 flex justify-end">
          <button className="bg-[#E77D35] text-white px-40 py-3 rounded-lg font-medium hover:bg-[#E77D35]/90 transition-all duration-200 shadow-sm hover:shadow-md">
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ia01;