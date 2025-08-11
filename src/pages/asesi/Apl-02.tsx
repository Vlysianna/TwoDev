import React, { useState, useEffect } from 'react';
import { Play, Eye, Search, Clock, BookOpen, User, X, AlertCircle } from 'lucide-react';
import NavbarAsesi from '@/components/NavbarAsesi';
import SideAsesi from '@/components/SideAsesi';
import { useNavigate } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';

interface Assessment {
  id: number;
  code: string;
  occupation: {
    id: number;
    name: string;
    scheme: {
      id: number;
      code: string;
      name: string;
    };
  };
  unit_competencies: {
    id: number;
    unit_code: string;
    title: string;
    elements: {
      id: number;
      title: string;
      element_details: {
        id: number;
        description: string;
      }[];
    }[];
  }[];
  created_at: string;
}

interface UserAssessment {
  id: number;
  status: string;
  created_at: string;
  assessment: Assessment;
}

export default function Apl02() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [userAssessments, setUserAssessments] = useState<UserAssessment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    fetchAssessments();
    fetchUserAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await api.get('/assessment/apl2');
      if (response.data.success) {
        setAssessments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      setError('Gagal memuat assessment APL-02');
    }
  };

  const fetchUserAssessments = async () => {
    try {
      const response = await api.get('/assessee/assessments');
      if (response.data.success) {
        const apl2Assessments = response.data.data.filter((ua: UserAssessment) => 
          ua.assessment.code && ua.assessment.code.includes('APL-02')
        );
        setUserAssessments(apl2Assessments);
      }
    } catch (error) {
      console.error('Failed to fetch user assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = async (assessmentId: number) => {
    try {
      setLoading(true);
      const response = await api.post('/assessee/start-assessment', {
        assessment_id: assessmentId
      });

      if (response.data.success) {
        // Refresh user assessments and navigate
        await fetchUserAssessments();
        navigate(`${paths.asesi.asesmenPilihanGanda}`);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Gagal memulai assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
  };

  const isAssessmentStarted = (assessmentId: number) => {
    return userAssessments.some(ua => ua.assessment.id === assessmentId);
  };

  const getAssessmentStatus = (assessmentId: number) => {
    const userAssessment = userAssessments.find(ua => ua.assessment.id === assessmentId);
    return userAssessment?.status || null;
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.occupation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.occupation.scheme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SideAsesi />
        <div className="flex-1 flex flex-col">
          <NavbarAsesi title="Assessment APL-02" icon={<BookOpen size={20} />} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E77D35] mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat assessment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideAsesi />
      <div className="flex-1 flex flex-col">
        <NavbarAsesi title="Assessment APL-02" icon={<BookOpen size={20} />} />
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-[#E77D35]" />
                Assessment APL-02
              </h1>
              <p className="text-gray-600 mt-2">
                Pilih assessment APL-02 yang telah dibuat oleh admin untuk memulai proses evaluasi kompetensi.
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari assessment berdasarkan kode, okupasi, atau skema..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]"
                />
              </div>
            </div>

            {/* Assessment Grid */}
            {filteredAssessments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Tidak ada assessment yang sesuai' : 'Belum ada assessment APL-02'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Coba ubah kata kunci pencarian Anda'
                    : 'Assessment APL-02 akan tersedia setelah admin membuatnya'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssessments.map((assessment) => (
                  <div key={assessment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {assessment.code}
                        </h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            {assessment.occupation.name}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <BookOpen className="w-4 h-4 mr-2" />
                            {assessment.occupation.scheme.name}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {new Date(assessment.created_at).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      {isAssessmentStarted(assessment.id) && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getAssessmentStatus(assessment.id) === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : getAssessmentStatus(assessment.id) === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {getAssessmentStatus(assessment.id) === 'completed' 
                            ? 'Selesai'
                            : getAssessmentStatus(assessment.id) === 'in_progress'
                            ? 'Sedang Berjalan'
                            : 'Dimulai'
                          }
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Unit Kompetensi: {assessment.unit_competencies.length} unit
                      </p>
                      <div className="text-xs text-gray-500">
                        Total Elemen: {assessment.unit_competencies.reduce((acc, unit) => acc + unit.elements.length, 0)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(assessment)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-normal py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </button>
                      
                      {!isAssessmentStarted(assessment.id) ? (
                        <button
                          onClick={() => handleStartAssessment(assessment.id)}
                          className="flex-1 bg-[#E77D35] hover:bg-orange-600 text-white font-normal py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Mulai
                        </button>
                      ) : getAssessmentStatus(assessment.id) === 'completed' ? (
                        <button
                          disabled
                          className="flex-1 bg-green-500 text-white font-normal py-2 px-4 rounded-md opacity-50 cursor-not-allowed flex items-center justify-center"
                        >
                          Selesai
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`${paths.asesi.asesmenPilihanGanda}`)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-normal py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                        >
                          Lanjutkan
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Detail Assessment: {selectedAssessment.code}
                </h2>
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Assessment Info */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informasi Assessment</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Okupasi:</span>
                    <span className="font-medium">{selectedAssessment.occupation.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skema:</span>
                    <span className="font-medium">{selectedAssessment.occupation.scheme.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kode Skema:</span>
                    <span className="font-medium">{selectedAssessment.occupation.scheme.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dibuat:</span>
                    <span className="font-medium">
                      {new Date(selectedAssessment.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Unit Competencies */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Unit Kompetensi</h3>
                <div className="space-y-4">
                  {selectedAssessment.unit_competencies.map((unit, unitIndex) => (
                    <div key={unit.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900">{unit.unit_code}</h4>
                        <p className="text-gray-600">{unit.title}</p>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-gray-700">Elemen Kompetensi:</h5>
                        {unit.elements.map((element, elementIndex) => (
                          <div key={element.id} className="ml-4 border-l-2 border-gray-200 pl-4">
                            <h6 className="font-medium text-gray-800">{element.title}</h6>
                            <ul className="mt-2 space-y-1">
                              {element.element_details.map((detail, detailIndex) => (
                                <li key={detail.id} className="text-sm text-gray-600">
                                  • {detail.description}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-normal py-2 px-6 rounded-md transition duration-200"
                >
                  Tutup
                </button>
                {!isAssessmentStarted(selectedAssessment.id) && (
                  <button
                    onClick={() => {
                      setSelectedAssessment(null);
                      handleStartAssessment(selectedAssessment.id);
                    }}
                    className="bg-[#E77D35] hover:bg-orange-600 text-white font-normal py-2 px-6 rounded-md transition duration-200"
                  >
                    Mulai Assessment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}