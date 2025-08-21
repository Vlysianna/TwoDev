import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle, Save } from 'lucide-react';
import NavAdmin from '@/components/NavAdmin';
import SideAdmin from '@/components/SideAdmin';
import { useNavigate } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';

interface ElementDetail {
  description: string;
}

interface Element {
  title: string;
  element_details: ElementDetail[];
}

interface UnitCompetency {
  unit_code: string;
  title: string;
  elements: Element[];
}

interface Occupation {
  id: number;
  name: string;
  scheme: {
    id: number;
    code: string;
    name: string;
  };
}

export default function AdminApl02() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  
  const [formData, setFormData] = useState({
    occupation_id: '',
    code: '',
    unit_competencies: [] as UnitCompetency[]
  });

  useEffect(() => {
    fetchOccupations();
  }, []);

  const fetchOccupations = async () => {
    try {
  const response = await api.get('/occupations');
      if (response.data.success) {
        setOccupations(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch occupations:', error);
    }
  };

  const addUnitCompetency = () => {
    setFormData(prev => ({
      ...prev,
      unit_competencies: [
        ...prev.unit_competencies,
        {
          unit_code: '',
          title: '',
          elements: [{
            title: '',
            element_details: [{ description: '' }]
          }]
        }
      ]
    }));
  };

  const removeUnitCompetency = (index: number) => {
    setFormData(prev => ({
      ...prev,
      unit_competencies: prev.unit_competencies.filter((_, i) => i !== index)
    }));
  };

  const updateUnitCompetency = (index: number, field: keyof UnitCompetency, value: any) => {
    setFormData(prev => ({
      ...prev,
      unit_competencies: prev.unit_competencies.map((unit, i) => 
        i === index ? { ...unit, [field]: value } : unit
      )
    }));
  };

  const addElement = (unitIndex: number) => {
    setFormData(prev => ({
      ...prev,
      unit_competencies: prev.unit_competencies.map((unit, i) => 
        i === unitIndex 
          ? {
              ...unit,
              elements: [
                ...unit.elements,
                { title: '', element_details: [{ description: '' }] }
              ]
            }
          : unit
      )
    }));
  };

  const removeElement = (unitIndex: number, elementIndex: number) => {
    setFormData(prev => ({
      ...prev,
      unit_competencies: prev.unit_competencies.map((unit, i) => 
        i === unitIndex 
          ? {
              ...unit,
              elements: unit.elements.filter((_, ei) => ei !== elementIndex)
            }
          : unit
      )
    }));
  };

  const updateElement = (unitIndex: number, elementIndex: number, field: keyof Element, value: any) => {
    setFormData(prev => ({
      ...prev,
      unit_competencies: prev.unit_competencies.map((unit, i) => 
        i === unitIndex 
          ? {
              ...unit,
              elements: unit.elements.map((element, ei) => 
                ei === elementIndex ? { ...element, [field]: value } : element
              )
            }
          : unit
      )
    }));
  };

  const addElementDetail = (unitIndex: number, elementIndex: number) => {
    setFormData(prev => ({
      ...prev,
      unit_competencies: prev.unit_competencies.map((unit, i) => 
        i === unitIndex 
          ? {
              ...unit,
              elements: unit.elements.map((element, ei) => 
                ei === elementIndex 
                  ? {
                      ...element,
                      element_details: [...element.element_details, { description: '' }]
                    }
                  : element
              )
            }
          : unit
      )
    }));
  };

  const removeElementDetail = (unitIndex: number, elementIndex: number, detailIndex: number) => {
    setFormData(prev => ({
      ...prev,
      unit_competencies: prev.unit_competencies.map((unit, i) => 
        i === unitIndex 
          ? {
              ...unit,
              elements: unit.elements.map((element, ei) => 
                ei === elementIndex 
                  ? {
                      ...element,
                      element_details: element.element_details.filter((_, di) => di !== detailIndex)
                    }
                  : element
              )
            }
          : unit
      )
    }));
  };

  const updateElementDetail = (unitIndex: number, elementIndex: number, detailIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      unit_competencies: prev.unit_competencies.map((unit, i) => 
        i === unitIndex 
          ? {
              ...unit,
              elements: unit.elements.map((element, ei) => 
                ei === elementIndex 
                  ? {
                      ...element,
                      element_details: element.element_details.map((detail, di) => 
                        di === detailIndex ? { description: value } : detail
                      )
                    }
                  : element
              )
            }
          : unit
      )
    }));
  };

  const validateForm = () => {
    if (!formData.occupation_id) {
      setError('Okupasi harus dipilih');
      return false;
    }
    if (!formData.code.trim()) {
      setError('Kode assessment harus diisi');
      return false;
    }
    if (formData.unit_competencies.length === 0) {
      setError('Minimal harus ada satu unit kompetensi');
      return false;
    }

    for (let i = 0; i < formData.unit_competencies.length; i++) {
      const unit = formData.unit_competencies[i];
      if (!unit.unit_code.trim() || !unit.title.trim()) {
        setError(`Unit kompetensi ${i + 1}: Kode dan judul harus diisi`);
        return false;
      }
      if (unit.elements.length === 0) {
        setError(`Unit kompetensi ${i + 1}: Minimal harus ada satu elemen`);
        return false;
      }

      for (let j = 0; j < unit.elements.length; j++) {
        const element = unit.elements[j];
        if (!element.title.trim()) {
          setError(`Unit kompetensi ${i + 1}, Elemen ${j + 1}: Judul harus diisi`);
          return false;
        }
        if (element.element_details.length === 0) {
          setError(`Unit kompetensi ${i + 1}, Elemen ${j + 1}: Minimal harus ada satu detail`);
          return false;
        }

        for (let k = 0; k < element.element_details.length; k++) {
          const detail = element.element_details[k];
          if (!detail.description.trim()) {
            setError(`Unit kompetensi ${i + 1}, Elemen ${j + 1}, Detail ${k + 1}: Deskripsi harus diisi`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user?.id) {
      setError('User tidak ditemukan. Silakan login ulang.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiData = {
        occupation_id: parseInt(formData.occupation_id),
        code: formData.code,
        unit_competencies: formData.unit_competencies
      };

      const response = await api.post('/assessment/apl2/create-assessment', apiData);

      if (response.data.success) {
        setSuccess('Assessment APL-02 berhasil dibuat!');
        
        // Reset form
        setFormData({
          occupation_id: '',
          code: '',
          unit_competencies: []
        });

        setTimeout(() => {
          navigate(paths.admin.root);
        }, 2000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Gagal membuat assessment. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideAdmin />
      <div className="flex-1 flex flex-col">
        <NavAdmin />
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Save className="w-6 h-6 mr-3 text-[#E77D35]" />
                Buat Assessment APL-02
              </h1>
              <p className="text-gray-600 mt-2">
                Buat assessment APL-02 dengan unit kompetensi dan elemen yang akan digunakan oleh asesi.
              </p>
            </div>

            {/* Notifications */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Assessment Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Informasi Assessment</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Occupation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Okupasi
                    </label>
                    <select
                      value={formData.occupation_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, occupation_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]"
                    >
                      <option value="">Pilih okupasi</option>
                      {occupations.map((occupation) => (
                        <option key={occupation.id} value={occupation.id}>
                          {occupation.name} - {occupation.scheme.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assessment Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kode Assessment
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="Masukkan kode assessment"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]"
                    />
                  </div>
                </div>
              </div>

              {/* Unit Competencies Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Unit Kompetensi</h2>
                    <p className="text-gray-600 text-sm">
                      Tambahkan unit kompetensi beserta elemen dan detail yang diperlukan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addUnitCompetency}
                    className="bg-[#E77D35] hover:bg-orange-600 text-white font-normal py-2 px-4 rounded-md transition duration-200 flex items-center"
                  >
                    <Plus size={16} className="mr-2" />
                    Tambah Unit
                  </button>
                </div>

                {formData.unit_competencies.length === 0 && (
                  <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    Belum ada unit kompetensi. Klik "Tambah Unit" untuk menambahkan.
                  </div>
                )}

                {formData.unit_competencies.map((unit, unitIndex) => (
                  <div key={unitIndex} className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800">Unit Kompetensi {unitIndex + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeUnitCompetency(unitIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kode Unit
                        </label>
                        <input
                          type="text"
                          value={unit.unit_code}
                          onChange={(e) => updateUnitCompetency(unitIndex, 'unit_code', e.target.value)}
                          placeholder="Masukkan kode unit"
                          className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Judul Unit
                        </label>
                        <input
                          type="text"
                          value={unit.title}
                          onChange={(e) => updateUnitCompetency(unitIndex, 'title', e.target.value)}
                          placeholder="Masukkan judul unit"
                          className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]"
                        />
                      </div>
                    </div>

                    {/* Elements Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-700">Elemen</h4>
                        <button
                          type="button"
                          onClick={() => addElement(unitIndex)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-normal py-1 px-3 rounded-md transition duration-200 flex items-center text-sm"
                        >
                          <Plus size={14} className="mr-1" />
                          Tambah Elemen
                        </button>
                      </div>

                      {unit.elements.map((element, elementIndex) => (
                        <div key={elementIndex} className="border border-gray-300 rounded-md p-4 mb-4 bg-white">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="text-sm font-medium text-gray-600">Elemen {elementIndex + 1}</h5>
                            <button
                              type="button"
                              onClick={() => removeElement(unitIndex, elementIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Judul Elemen
                            </label>
                            <input
                              type="text"
                              value={element.title}
                              onChange={(e) => updateElement(unitIndex, elementIndex, 'title', e.target.value)}
                              placeholder="Masukkan judul elemen"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]"
                            />
                          </div>

                          {/* Element Details */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <label className="block text-sm font-medium text-gray-700">Detail Elemen</label>
                              <button
                                type="button"
                                onClick={() => addElementDetail(unitIndex, elementIndex)}
                                className="bg-green-500 hover:bg-green-600 text-white font-normal py-1 px-2 rounded-md transition duration-200 flex items-center text-xs"
                              >
                                <Plus size={12} className="mr-1" />
                                Tambah Detail
                              </button>
                            </div>

                            {element.element_details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="flex items-center mb-2">
                                <input
                                  type="text"
                                  value={detail.description}
                                  onChange={(e) => updateElementDetail(unitIndex, elementIndex, detailIndex, e.target.value)}
                                  placeholder="Masukkan deskripsi detail"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] mr-2"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeElementDetail(unitIndex, elementIndex, detailIndex)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#E77D35] hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-normal py-2 px-8 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:ring-offset-2"
                >
                  {loading ? 'Membuat Assessment...' : 'Buat Assessment APL-02'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
