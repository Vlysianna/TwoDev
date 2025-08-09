import React, { useState } from 'react';
import { Monitor, ChevronLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAsesor from '@/components/NavAsesor';

interface Criteria {
  id: string;
  text: string;
}

interface AssessmentItem {
  id: number;
  elemen: string;
  criteria: Criteria[];
}

const PenilaianLanjut: React.FC<{ initialValue?: string; onChange: (value: string) => void }> = ({ 
  initialValue = '', 
  onChange 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      onChange(value);
    }
  };

  return (
    <div className="p-2">
      {isEditing ? (
        <textarea
          className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p
          className="text-gray-700 cursor-pointer min-h-[24px]"
          onClick={() => setIsEditing(true)}
        >
          {value || 'Klik untuk menambahkan penilaian...'}
        </p>
      )}
    </div>
  );
};

export default function FIIADetail() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKompeten, setFilterKompeten] = useState<'all' | 'kompeten' | 'belum'>('all');
  const [pencapaian, setPencapaian] = useState<Record<number, string>>({});
  const [penilaianLanjut, setPenilaianLanjut] = useState<Record<number, string>>({});

  const assessmentData: AssessmentItem[] = [
    {
      id: 1,
      elemen: 'Menggunakan metode pengembangan program',
      criteria: [
        { id: '1.1', text: 'Mendefinisikan Metode pengembangan aplikasi (software development)' },
        { id: '1.2', text: 'Memilih Metode pengembangan aplikasi (software development) sesuai kebutuhan' }
      ]
    },
    {
      id: 2,
      elemen: 'Menggunakan diagram program dan deskripsi program',
      criteria: [
        { id: '2.1', text: 'Mendefinisikan Diagram program dengan metodologi pengembangan sistem' },
        { id: '2.2', text: 'Menggunakan Metode pemodelan, diagram objek dan diagram komponen digunakan pada implementasi program sesuai dengan spesifikasi' }
      ]
    },
    {
      id: 3,
      elemen: 'Menerapkan hasil pemodelan ke dalam pengembangan program pengembangan program',
      criteria: [
        { id: '3.1', text: 'Memilih Hasil pemodelan yang mendukung kemampuan metodologi sesuai spesifikasi.' },
        { id: '3.2', text: 'Memilih Hasil pemrograman (Integrated Development Environment-IDE) yang mendukung kemampuan metodologi bahasa pemrograman sesuai spesifikasi' }
      ]
    }
  ];

  const handlePencapaianChange = (id: number, value: string) => {
    setPencapaian(prev => ({ ...prev, [id]: value }));
  };

  const handlePenilaianLanjutChange = (id: number, value: string) => {
    setPenilaianLanjut(prev => ({ ...prev, [id]: value }));
  };

  const handleFilterChange = (value: 'all' | 'kompeten' | 'belum') => {
    setFilterKompeten(value);
    if (value === 'kompeten' || value === 'belum') {
      const newPencapaian: Record<number, string> = {};
      assessmentData.forEach(item => {
        newPencapaian[item.id] = value;
      });
      setPencapaian(newPencapaian);
    }
  };

  const filteredData = assessmentData.filter(item =>
    item.elemen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.criteria.some(criteria => criteria.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <NavbarAsesor
          title="Detail"
          icon={
            <Link to="/asesmen-mandiri" className="text-gray-500 hover:text-gray-600">
              <ChevronLeft size={20} />
            </Link>
          }
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm m-10 px-5 py-7">
        {/* Header */}
        <div className="pb-7 flex flex-wrap items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-[#00809D]">
            <Monitor size={20} />
            <span className="font-medium">Unit kompetensi 2</span>
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

          {/* Filter */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="filter"
                value="kompeten"
                checked={filterKompeten === 'kompeten'}
                onChange={() => handleFilterChange('kompeten')}
              />
              <span className="text-sm">Ceklis Semua Ya</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="filter"
                value="belum"
                checked={filterKompeten === 'belum'}
                onChange={() => handleFilterChange('belum')}
              />
              <span className="text-sm">Ceklis Semua Tidak</span>
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-sm">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-700">No</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Kriteria Untuk Kerja</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Standar Industri atau Tempat Kerja</th>
                <th className="p-4 text-center text-sm font-medium text-gray-700">Pencapaian</th>
                <th className="p-4 text-center text-sm font-medium text-gray-700">Penilaian Lanjut</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <React.Fragment key={item.id}>
                  {item.criteria.map((criteria, idx) => (
                    <tr key={criteria.id} className="border-t border-gray-200">
                      {idx === 0 && (
                        <td rowSpan={item.criteria.length} className="px-4 py-3 text-sm text-gray-900 align-top">
                          {item.id}
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-blue-600 min-w-8">{criteria.id}</span>
                          <span>{criteria.text}</span>
                        </div>
                      </td>
                      {idx === 0 && (
                        <td rowSpan={item.criteria.length} className="px-4 py-3 text-sm text-gray-900">
                          SKKNI
                        </td>
                      )}
                      {idx === 0 && (
                        <td rowSpan={item.criteria.length} className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-3">
                            <label className="flex items-center gap-1 text-sm">
                              <input
                                type="radio"
                                name={`pencapaian-${item.id}`}
                                value="kompeten"
                                checked={pencapaian[item.id] === 'kompeten'}
                                onChange={(e) => handlePencapaianChange(item.id, e.target.value)}
                              />
                              Ya
                            </label>
                            <label className="flex items-center gap-1 text-sm">
                              <input
                                type="radio"
                                name={`pencapaian-${item.id}`}
                                value="belum"
                                checked={pencapaian[item.id] === 'belum'}
                                onChange={(e) => handlePencapaianChange(item.id, e.target.value)}
                              />
                              Tidak
                            </label>
                          </div>
                        </td>
                      )}
                      {idx === 0 && (
                        <td rowSpan={item.criteria.length} className="px-4 py-3 text-center">
                          <PenilaianLanjut 
                            initialValue={penilaianLanjut[item.id] || ''}
                            onChange={(value) => handlePenilaianLanjutChange(item.id, value)}
                          />
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
  );
}