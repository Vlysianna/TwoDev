import React, { useState, useEffect } from "react";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import { Calendar, Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import paths from '@/routes/paths';
import axiosInstance from '@/helper/axios';
import { useForm } from "react-hook-form";

interface Scheme {
  id: number;
  code: string;
  name: string;
}

interface Occupation {
  id: number;
  name: string;
  scheme: Scheme;
}

interface Assessor {
  id: number;
  full_name: string;
}

interface ScheduleDetailForm {
  assessor_id: number;
  location: string;
}

interface ScheduleForm {
  occupation_id: number;
  start_date: string;
  end_date: string;
  schedule_details: ScheduleDetailForm[];
}

const TambahJadwal: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ScheduleForm>({
    defaultValues: {
      schedule_details: [{ assessor_id: 0, location: '' }]
    }
  });

  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [assessors, setAssessors] = useState<Assessor[]>([]);
  const [assessorsLoading, setAssessorsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleDetailForm[]>([
    { assessor_id: 0, location: '' }
  ]);

  // initial load: occupations + assessors
  useEffect(() => {
    (async () => {
      try {
        const occResp = await axiosInstance.get('/occupations');
        if (occResp.data?.success) {
          setOccupations(occResp.data.data);
        }
      } catch (err) {
        console.error('Error fetching occupations:', err);
      }

      try {
        setAssessorsLoading(true);
        const resp = await axiosInstance.get('/assessor');
        if (resp.data && resp.data.success) {
          const list: Assessor[] = resp.data.data;
          setAssessors(list);
          console.log('Assessor list:', list); // Debug log

          // set first assessor as default for first row if none selected
          if (list.length > 0) {
            setScheduleDetails(prev => {
              const firstSelected = prev.some(d => d.assessor_id && d.assessor_id !== 0);
              if (!firstSelected && prev.length > 0) {
                const firstId = list[0].id;
                const newDetails = prev.map((d, i) => (i === 0 ? { ...d, assessor_id: firstId } : d));
                setValue('schedule_details', newDetails);
                return newDetails;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.error('Error fetching assessors:', err);
        setError('Gagal memuat daftar asesor dari server');
      } finally {
        setAssessorsLoading(false);
      }
    })();
  }, []);

  const addScheduleDetail = () => {
    const newDetails = [...scheduleDetails, { assessor_id: 0, location: '' }];
    setScheduleDetails(newDetails);
    setValue('schedule_details', newDetails);
  };

  const removeScheduleDetail = (index: number) => {
    if (scheduleDetails.length > 1) {
      const newDetails = scheduleDetails.filter((_, i) => i !== index);
      setScheduleDetails(newDetails);
      setValue('schedule_details', newDetails);
    }
  };

  const onSubmit = async (data: ScheduleForm) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Create assessment first
      const assessmentResponse = await axiosInstance.post('/assessments/create', {
        occupation_id: data.occupation_id,
        code: `ASM-${Date.now()}` // Generate unique code
      });

      if (assessmentResponse.data.success) {
        // Create schedule with assessment_id
        const scheduleData = {
          assessment_id: assessmentResponse.data.data.id,
          start_date: new Date(data.start_date),
          end_date: new Date(data.end_date),
          schedule_details: data.schedule_details.filter(detail => 
            detail.assessor_id && detail.location.trim()
          )
        };

  const scheduleResponse = await axiosInstance.post('/schedules', scheduleData);
        
        if (scheduleResponse.data.success) {
          setSuccess('Jadwal berhasil ditambahkan!');
          setTimeout(() => {
            navigate(paths.admin.kelolaJadwal || '/admin/kelola-jadwal');
          }, 1000);
        } else {
          setError(scheduleResponse.data.message || 'Gagal membuat jadwal');
        }
      } else {
        setError('Gagal membuat assessment');
      }
    } catch (error: unknown) {
      console.error('Error creating schedule:', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any)?.response?.data?.message || 'Gagal membuat jadwal';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {/* Alerts */}
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

          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500">
              <span>Kelola Jadwal</span>
              <span className="mx-2">/</span>
              <span className="text-black">Tambah Jadwal</span>
            </nav>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Header */}
              <div className="p-6">
                <h2 className="text-[20px] sm:text-[26px] font-semibold text-black">
                  Tambah Jadwal Asesmen
                </h2>
                <div className="border-b border-gray-200 mt-4"></div>
              </div>

              {/* Form Content */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Data Asesmen */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Data Asesmen
                    </h3>
                    <div className="space-y-4">
                      {/* Pilih Okupasi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pilih Okupasi <span className="text-red-500">*</span>
                        </label>
                        <select 
                          {...register("occupation_id", { required: "Okupasi wajib dipilih" })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none"
                        >
                          <option value="">Pilih Okupasi</option>
                          {occupations.map((occupation) => (
                            <option key={occupation.id} value={occupation.id}>
                              {occupation.scheme.name} - {occupation.name}
                            </option>
                          ))}
                        </select>
                        {errors.occupation_id && (
                          <span className="text-red-500 text-sm">{errors.occupation_id.message}</span>
                        )}
                      </div>

                      {/* Tanggal Mulai */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal Mulai <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          {...register("start_date", { required: "Tanggal mulai wajib diisi" })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none"
                        />
                        {errors.start_date && (
                          <span className="text-red-500 text-sm">{errors.start_date.message}</span>
                        )}
                      </div>

                      {/* Tanggal Selesai */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal Selesai <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          {...register("end_date", { required: "Tanggal selesai wajib diisi" })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none"
                        />
                        {errors.end_date && (
                          <span className="text-red-500 text-sm">{errors.end_date.message}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Data Asesor */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Data Asesor
                      </h3>
                      <button
                        type="button"
                        onClick={addScheduleDetail}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600"
                      >
                        <Plus size={16} />
                        Tambah Asesor
                      </button>
                    </div>

                    <div className="space-y-4">
                      {scheduleDetails.map((detail, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">Asesor {index + 1}</h4>
                            {scheduleDetails.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeScheduleDetail(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pilih Asesor
                            </label>
                            <select
                              {...register(`schedule_details.${index}.assessor_id` as const)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none"
                              value={detail.assessor_id || ''}
                              onChange={(e) => {
                                const newDetails = [...scheduleDetails];
                                newDetails[index].assessor_id = parseInt(e.target.value);
                                setScheduleDetails(newDetails);
                                setValue('schedule_details', newDetails);
                              }}
                              disabled={assessorsLoading}
                            >
                              {assessorsLoading ? (
                                <option value="">Memuat asesor...</option>
                              ) : (
                                <>
                                  <option value="">Pilih Asesor</option>
                                  {assessors.length === 0 ? (
                                    <option value="">Tidak ada asesor</option>
                                  ) : (
                                    assessors.map((assessor) => (
                                      <option key={assessor.id} value={assessor.id}>
                                        {assessor.full_name}
                                      </option>
                                    ))
                                  )}
                                </>
                              )}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Lokasi
                            </label>
                            <input
                              type="text"
                              {...register(`schedule_details.${index}.location` as const)}
                              placeholder="Contoh: Ruang Lab 1"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none"
                              value={detail.location}
                              onChange={(e) => {
                                const newDetails = [...scheduleDetails];
                                newDetails[index].location = e.target.value;
                                setScheduleDetails(newDetails);
                                setValue('schedule_details', newDetails);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#E77D35] text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Jadwal'}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default TambahJadwal;
