import React, { useState, useEffect } from "react";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import { Plus, Trash2, AlertCircle, CheckCircle, File } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import paths from "@/routes/paths";
import axiosInstance from "@/helper/axios";
import { useForm, useFieldArray } from "react-hook-form";
import type { MukType } from "@/lib/types";

interface Assessor {
  id: number;
  name: string;
}

interface ScheduleDetailForm {
  id?: number;
  assessor_id?: number;
  location?: string;
}

interface ScheduleForm {
  assessment_id: number;
  start_date: string;
  end_date: string;
  schedule_details: ScheduleDetailForm[];
}

const EditJadwal: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    setValue,
    control,
  formState: { errors },
  } = useForm<ScheduleForm>({
    defaultValues: {
      assessment_id: 0,
      start_date: "",
      end_date: "",
      schedule_details: [{ assessor_id: 0, location: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "schedule_details",
  });

  const [assessments, setAssessments] = useState<MukType[]>([]);
  const [assessors, setAssessors] = useState<Assessor[]>([]);
  const [assessorsLoading, setAssessorsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // remove unused watch to avoid lint warnings

  function isoToLocalDatetime(iso?: string | null): string {
    if (!iso) return '';
    try {
      // parse ISO and produce local datetime-local string (no timezone)
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '';
      const pad = (n: number) => String(n).padStart(2, '0');
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const min = pad(d.getMinutes());
      const sec = pad(d.getSeconds());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}:${sec}`;
    } catch (e) {
      return '';
    }
  }

  useEffect(() => {
    // Fetch assessments and assessors first, then fetch schedule detail to ensure select options exist
    (async () => {
      try {
        setLoading(true);
        // fetch both in parallel
        const [assessmentResp, assessorResp] = await Promise.all([
          axiosInstance.get('/assessments'),
          axiosInstance.get('/assessor')
        ]);

        if (assessmentResp.data?.success) setAssessments(assessmentResp.data.data);
        if (assessorResp.data?.success) setAssessors(assessorResp.data.data);

        // now fetch schedule detail (if id provided)
        if (id) {
          const resp = await axiosInstance.get(`/schedules/${id}`);
          if (resp.data?.success) {
            const data = Array.isArray(resp.data.data) ? resp.data.data[0] : resp.data.data;
            setValue('assessment_id', data.assessment?.id || 0);
            setValue('start_date', isoToLocalDatetime(data.start_date));
            setValue('end_date', isoToLocalDatetime(data.end_date));
            if (Array.isArray(data.schedule_details)) {
              // normalize assessor_id to one that exists in loaded assessors, otherwise fallback to 0
              const availableAssessorIds = (assessorResp.data?.success ? assessorResp.data.data : []).map((a: any) => a.id);
              replace(data.schedule_details.map((d: any) => {
                const candidateId = d.assessor?.id || d.assessor_id || 0;
                return {
                  id: d.id,
                  assessor_id: availableAssessorIds.includes(candidateId) ? candidateId : 0,
                  location: d.location || ''
                };
              }));
            }
          } else {
            setError('Gagal memuat detail jadwal');
          }
        }
      } catch (err: any) {
        console.error('Error fetching data for edit page:', err);
        setError(err?.response?.data?.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
        setAssessorsLoading(false);
      }
    })();
  }, [id, replace, setValue]);

  const addScheduleDetail = () => append({ assessor_id: 0, location: '' });
  const removeScheduleDetail = (index: number) => { if (fields.length > 1) remove(index); };

  const onSubmit = async (data: ScheduleForm) => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // basic validations
      if (!data.assessment_id || data.assessment_id === 0) { setError('Assessment wajib dipilih'); setLoading(false); return; }
      if (!data.start_date || !data.end_date) { setError('Tanggal wajib diisi'); setLoading(false); return; }
      if (new Date(data.start_date) >= new Date(data.end_date)) { setError('Tanggal selesai harus setelah tanggal mulai'); setLoading(false); return; }

      const payload = {
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        schedule_details: data.schedule_details.map(d => ({ ...(d.id ? { id: d.id } : {}), assessor_id: d.assessor_id ? Number(d.assessor_id) : undefined, location: (d.location || '').trim() }))
      };

      const res = await axiosInstance.put(`/schedules/${id}`, payload);
      if (res.data?.success) {
        setSuccess('Jadwal berhasil diupdate');
        setTimeout(() => navigate(paths.admin.kelolaJadwal), 1200);
      } else {
        setError(res.data?.message || 'Gagal mengupdate jadwal');
      }
    } catch (err: any) {
      console.error('Error updating schedule:', err);
      setError(err?.response?.data?.message || 'Gagal mengupdate jadwal');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(paths.admin.kelolaJadwal);

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Edit Jadwal" icon={<File size={20} />} />
        <main className="flex-1 overflow-auto p-6">
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

          <div className="mb-6">
            <nav className="flex text-sm text-gray-500"><span>Kelola Jadwal</span><span className="mx-2">/</span><span className="text-black">Edit Jadwal</span></nav>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-[20px] sm:text-[26px] font-semibold text-black">Edit Jadwal Asesmen</h2>
                <div className="border-b border-gray-200 mt-4"></div>
              </div>

              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data Asesmen</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Assessment <span className="text-red-500">*</span></label>
                        <select {...register("assessment_id", { required: "Assessment wajib dipilih", validate: value => value !== 0 || "Assessment wajib dipilih" })} className={`w-full border ${errors.assessment_id ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm`}>
                          <option value={0}>Pilih Assessment</option>
                          {assessments.map(a => <option key={a.id} value={a.id}>{a.code} - {a.occupation.name}</option>)}
                        </select>
                        {errors.assessment_id && <span className="text-red-500 text-sm">{errors.assessment_id.message}</span>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai <span className="text-red-500">*</span></label>
                        <input type="datetime-local" {...register("start_date", { required: "Tanggal mulai wajib diisi" })} className={`w-full border ${errors.start_date ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm`} />
                        {errors.start_date && <span className="text-red-500 text-sm">{errors.start_date.message}</span>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai <span className="text-red-500">*</span></label>
                        <input type="datetime-local" {...register("end_date", { required: "Tanggal selesai wajib diisi" })} className={`w-full border ${errors.end_date ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm`} />
                        {errors.end_date && <span className="text-red-500 text-sm">{errors.end_date.message}</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Data Asesor</h3>
                      <button type="button" onClick={addScheduleDetail} className="flex items-center gap-2 px-3 py-1.5 bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600"><Plus size={16} />Tambah Asesor</button>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-200 rounded-md space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">Asesor {index + 1}</h4>
                            {fields.length > 1 && (<button type="button" onClick={() => removeScheduleDetail(index)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>)}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Asesor <span className="text-red-500">*</span></label>
                            <select {...register(`schedule_details.${index}.assessor_id` as const, { required: "Asesor wajib dipilih", validate: value => value !== 0 || "Asesor wajib dipilih" })} className={`w-full border ${errors.schedule_details?.[index]?.assessor_id ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm`} disabled={assessorsLoading}>
                              {assessorsLoading ? <option value={0}>Memuat asesor...</option> : (<>
                                <option value={0}>Pilih Asesor</option>
                                {assessors.length === 0 ? <option value={0}>Tidak ada asesor</option> : assessors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                              </>)}
                            </select>
                            {errors.schedule_details?.[index]?.assessor_id && <span className="text-red-500 text-sm">{errors.schedule_details[index]?.assessor_id?.message}</span>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi <span className="text-red-500">*</span></label>
                            <input type="text" {...register(`schedule_details.${index}.location` as const, { required: "Lokasi wajib diisi", minLength: { value: 2, message: "Lokasi minimal 2 karakter" } })} placeholder="Contoh: Ruang Lab 1" className={`w-full border ${errors.schedule_details?.[index]?.location ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm`} />
                            {errors.schedule_details?.[index]?.location && <span className="text-red-500 text-sm">{errors.schedule_details[index]?.location?.message}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex gap-4">
                    <button type="submit" disabled={loading} className="bg-[#E77D35] text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                    <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400">Batal</button>
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

export default EditJadwal;
