import React from 'react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import { useNavigate } from 'react-router-dom';

// Dummy data untuk Result Assessment
const dummyResults = [
  {
    assessmentName: 'Assessment Web Developer',
    schedules: [
      {
        id: 1,
        start_date: '2025-09-10',
        end_date: '2025-09-12',
        scheme: 'Web Developer',
        occupation: 'Frontend',
        assessees: [
          { id: 101, name: 'Budi Santoso', email: 'budi@example.com', status: 'Lulus' },
          { id: 102, name: 'Siti Aminah', email: 'siti@example.com', status: 'Tidak Lulus' },
        ],
      },
      {
        id: 2,
        start_date: '2025-09-15',
        end_date: '2025-09-17',
        scheme: 'Web Developer',
        occupation: 'Backend',
        assessees: [
          { id: 103, name: 'Andi Wijaya', email: 'andi@example.com', status: 'Lulus' },
        ],
      },
    ],
  },
  {
    assessmentName: 'Assessment UI/UX',
    schedules: [
      {
        id: 3,
        start_date: '2025-09-20',
        end_date: '2025-09-22',
        scheme: 'UI/UX Designer',
        occupation: 'UI Designer',
        assessees: [
          { id: 104, name: 'Rina Dewi', email: 'rina@example.com', status: 'Lulus' },
        ],
      },
    ],
  },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const ResultAssessment: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F7FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Result Assessment</h1>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 bg-[#E77D35] text-white rounded hover:bg-orange-600 transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>
          {dummyResults.length === 0 ? (
            <div className="text-gray-500 text-center py-8">Belum ada hasil assessment</div>
          ) : (
            <div className="space-y-8">
              {dummyResults.map((assessment, idx) => (
                <div key={idx} className="border rounded-lg">
                  <div className="bg-[#E77D35] text-white px-4 py-2 rounded-t-lg font-semibold">
                    {assessment.assessmentName}
                  </div>
                  <div className="p-4">
                    {assessment.schedules.length === 0 ? (
                      <div className="text-gray-500">Tidak ada jadwal</div>
                    ) : (
                      <div className="space-y-6">
                        {assessment.schedules.map((sch) => (
                          <div key={sch.id} className="border border-gray-200 rounded-lg">
                            <div className="flex flex-wrap items-center justify-between bg-gray-50 px-4 py-2 rounded-t-lg">
                              <div>
                                <span className="font-medium text-gray-800">{sch.scheme}</span> - <span className="text-gray-600">{sch.occupation}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(sch.start_date)} - {formatDate(sch.end_date)}
                              </div>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-[#E77D35] text-white">
                                    <th className="px-4 py-2 text-left text-sm font-medium">Nama Asesi</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {sch.assessees.length === 0 ? (
                                    <tr>
                                      <td colSpan={3} className="px-4 py-4 text-center text-gray-500">Belum ada asesi</td>
                                    </tr>
                                  ) : (
                                    sch.assessees.map((as) => (
                                      <tr key={as.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{as.name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{as.email}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                          <span className={`px-2 py-1 rounded text-xs font-semibold ${as.status === 'Lulus' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{as.status}</span>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ResultAssessment;
