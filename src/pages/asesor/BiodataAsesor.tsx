import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { ArrowLeft, FileText, LayoutDashboard, Upload, AlertCircle } from 'lucide-react';
import NavbarAsesor from '@/components/NavAsesor';
import api from '@/helper/axios';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import paths from '@/routes/paths';
import SidebarAsesor from '@/components/SideAsesor';
import { useBiodataCheck } from '@/hooks/useBiodataCheck';

export default function BiodataAsesor() {
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    tempatLahir: '', // This will be stored in localStorage for now as it's not in DB schema
    tanggalLahir: '',
    email: '',
    noRegMET: '',
    noTelp: '',
    catatan: '' // This will be stored in localStorage for now as it's not in DB schema
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    npwp: null,
    coverBuku: null,
    sertifikatAsesor: null,
    pasFoto: null,
    ktp: null
  });

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshBiodataCheck } = useBiodataCheck();
  const [assessor, setAssessor] = useState<Record<string, unknown> | null>(null);
  const [assessorDetail, setAssessorDetail] = useState<Record<string, unknown> | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);

  const safeGet = (obj: Record<string, unknown> | null, key: string) => {
    if (!obj) return '';
    const v = obj[key];
    if (v === undefined || v === null) return '';
    return String(v);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (fileType: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        // get assessor by user id
        const resp = await api.get(`/assessor/user/${user.id}`);
        if (resp.data?.success) {
          setAssessor(resp.data.data);
          // try load assessor detail
          try {
            const det = await api.get(`/assessor-detail/${resp.data.data.id}`);
            if (det.data?.success) setAssessorDetail(det.data.data);
          } catch (detailError: any) {
            // 404 is normal if assessor detail doesn't exist yet
            if (detailError.response?.status !== 404) {
              console.error('Error loading assessor detail:', detailError);
            }
          }
        }
      } catch (error: any) {
        // Handle different error types
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          console.error('Authentication failed - redirecting to login');
          navigate('/login');
          return;
        } else if (error.response?.status === 404) {
          // New user without assessor data - this is normal
          console.log('New user - no assessor data yet');
        } else {
          console.error('Error loading assessor data:', error);
        }
      }
      
      // Load additional data from localStorage
      const savedAdditionalData = localStorage.getItem(`assessor_additional_${user.id}`);
      if (savedAdditionalData) {
        try {
          const additionalData = JSON.parse(savedAdditionalData);
          setFormData(prev => ({
            ...prev,
            tempatLahir: additionalData.tempatLahir || '',
            catatan: additionalData.catatan || ''
          }));
        } catch {
          // ignore parsing errors
        }
      }
      
      setInitialLoading(false);
    };

    load();
  }, [user]);

  // populate form when assessor or assessorDetail loaded
  useEffect(() => {
    if (assessor) {
      setFormData(prev => ({
        ...prev,
        nama: safeGet(assessor, 'name') || user?.full_name || prev.nama || '', // Use name from assessor or user.full_name
        email: user?.email || prev.email || '', // email comes from user context
        alamat: safeGet(assessor, 'address') || prev.alamat || '', // address is in assessor table
        tanggalLahir: safeGet(assessor, 'birth_date') || prev.tanggalLahir || '', // birth_date is in assessor table
        noRegMET: safeGet(assessor, 'no_reg_met') || prev.noRegMET || '', // no_reg_met is in assessor table
        noTelp: safeGet(assessor, 'phone_no') || prev.noTelp || '', // phone_no is in assessor table
      }));
    } else if (user) {
      // For new users without assessor data, pre-fill with user data
      setFormData(prev => ({
        ...prev,
        nama: user.full_name || prev.nama || '',
        email: user.email || prev.email || '',
      }));
    }

    if (assessorDetail) {
      // Don't override noRegMET since it should come from assessor table, not detail
      // assessor_detail.tax_id_number is for NPWP file path, not the actual number
    }
  }, [assessor, assessorDetail, user]);

  // Check for redirect message
  useEffect(() => {
    if (location.state && (location.state as any).message) {
      setRedirectMessage((location.state as any).message);
      // Clear the message after 10 seconds
      const timer = setTimeout(() => {
        setRedirectMessage(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      // 1) Prepare file uploads
      const uploaded: Record<string, string> = {};
      const fileMapping = {
        npwp: 'tax_id_number',
        coverBuku: 'bank_book_cover', 
        sertifikatAsesor: 'certificate',
        ktp: 'national_id',
        pasFoto: 'id_card'
      };

      // Upload files if present
      for (const [frontendKey, backendKey] of Object.entries(fileMapping)) {
        const file = files[frontendKey];
        if (file) {
          const fd = new FormData();
          fd.append('file', file);
          try {
            const up = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (up.data?.success && up.data.data?.path) {
              uploaded[backendKey] = up.data.data.path;
            }
          } catch (uploadError) {
            console.error(`Failed to upload ${frontendKey}:`, uploadError);
            // Continue with other files even if one fails
          }
        }
      }

      // 2) Create or update assessor basic data
      let assessorId = assessor?.id;
      
      if (assessorId) {
        // Update existing assessor
        await api.put(`/assessor/${assessorId}`, {
          user_id: user.id,
          scheme_id: (assessor?.scheme_id as number) ?? 1, // default scheme_id if not set
          address: formData.alamat,
          phone_no: formData.noTelp,
          birth_date: formData.tanggalLahir,
          no_reg_met: formData.noRegMET,
        });
      } else {
        // Create new assessor if doesn't exist
        const createResp = await api.post('/assessor', {
          user_id: user.id,
          scheme_id: 1, // default scheme_id
          address: formData.alamat,
          phone_no: formData.noTelp,
          birth_date: formData.tanggalLahir,
          no_reg_met: formData.noRegMET,
        });
        
        if (createResp.data?.success) {
          assessorId = createResp.data.data.id;
          setAssessor(createResp.data.data);
        }
      }

      // 3) Upsert assessor-detail
      if (assessorId) {
        try {
          await api.post(`/assessor-detail/${assessorId}`, {
            tax_id_number: uploaded.tax_id_number || safeGet(assessorDetail, 'tax_id_number') || '',
            bank_book_cover: uploaded.bank_book_cover || safeGet(assessorDetail, 'bank_book_cover') || '',
            certificate: uploaded.certificate || safeGet(assessorDetail, 'certificate') || '',
            national_id: uploaded.national_id || safeGet(assessorDetail, 'national_id') || '',
            id_card: uploaded.id_card || safeGet(assessorDetail, 'id_card') || '',
          });
        } catch (detailError: any) {
          console.error('Error saving assessor detail:', detailError);
          // Continue with saving even if detail fails
        }
      }

      // refresh local detail
      try {
        const det = await api.get(`/assessor-detail/${assessorId}`);
        if (det.data?.success) setAssessorDetail(det.data.data);
      } catch {
        // ignore
      }

      // Save additional data to localStorage (data not in database schema)
      const additionalData = {
        tempatLahir: formData.tempatLahir,
        catatan: formData.catatan
      };
      localStorage.setItem(`assessor_additional_${user.id}`, JSON.stringify(additionalData));

      setSuccessMessage('Data berhasil disimpan');
      
      // Refresh biodata check to update sidebar
      await refreshBiodataCheck();
      
      // If came from redirect, navigate back to original page after 2 seconds
      if (location.state && (location.state as any).from) {
        setTimeout(() => {
          navigate((location.state as any).from, { replace: true });
        }, 2000);
      } else {
        // Navigate to dashboard after 2 seconds
        setTimeout(() => {
          navigate(paths.asesor.dashboardAsesor, { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
        <SidebarAsesor />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <NavbarAsesor title="Biodata Asesor" icon={<FileText size={25} />}
          />
        </div>

        {/* Main Body */}
        <main className="p-4">
          {initialLoading && (
            <div className="p-4 mb-4 bg-white rounded shadow-sm text-sm text-gray-600">Memuat data...</div>
          )}
          {successMessage && (
            <div className="p-4 mb-4 bg-green-50 border border-green-200 text-green-800 rounded">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-800 rounded">{errorMessage}</div>
          )}
          {redirectMessage && (
            <div className="p-4 mb-4 bg-orange-50 border border-orange-200 text-orange-800 rounded flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{redirectMessage}</span>
            </div>
          )}

          {/* Welcome Card - show completion status */}
          {!initialLoading && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Status Biodata Asesor
                  </h3>
                  {!assessor || !assessorDetail ? (
                    <>
                      <p className="text-blue-800 text-sm mb-3">
                        Untuk mengakses Dashboard dan fitur-fitur asesor lainnya, Anda perlu melengkapi biodata terlebih dahulu. 
                        Hal ini diperlukan untuk memastikan proses sertifikasi yang akurat dan sesuai standar.
                      </p>
                      <div className="flex items-center space-x-2 text-blue-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">
                          Belum lengkap - Lengkapi semua field yang diperlukan
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-blue-800 text-sm mb-3">
                        Biodata Anda sudah tersimpan. Anda dapat memperbarui informasi kapan saja.
                        Setelah disimpan, Anda akan dapat mengakses semua fitur asesor.
                      </p>
                      <div className="flex items-center space-x-2 text-green-700">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium">
                          Biodata lengkap - Akses penuh tersedia
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Biodata Asesor Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Biodata Asesor</h2>
              <p className="text-gray-600 text-sm mb-6">
                Isi biodata Anda dengan akurat untuk memastikan proses sertifikasi yang lancar. Semua informasi akan
                digunakan semata-mata untuk keperluan administrasi dan verifikasi Uji Sertifikasi Kompetensi (USK).
              </p>

              {/* Form Grid - Responsive */}
              <div className="space-y-6">
                {/* First Row - 1 column on mobile, 2 columns on medium+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Nama */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                    <input type="text" name="nama" value={formData.nama} onChange={handleInputChange}
                      placeholder="Masukkan nama anda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                  </div>

                  {/* Alamat */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                    <input type="text" name="alamat" value={formData.alamat} onChange={handleInputChange}
                      placeholder="Masukkan alamat anda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                  </div>
                </div>

                {/* Second Row - Stacked on mobile, custom grid on desktop */}
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-6">
                  {/* Tempat lahir - full width on mobile, 4 cols on desktop */}
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tempat lahir</label>
                    <input type="text" name="tempatLahir" value={formData.tempatLahir}
                      onChange={handleInputChange} placeholder="Masukkan tempat lahir anda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                  </div>

                  {/* Pilih tanggal - full width on mobile, 2 cols on desktop */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih tanggal</label>
                    <div className="relative">
                      <input type="date" name="tanggalLahir" value={formData.tanggalLahir}
                        onChange={handleInputChange} placeholder="Pilih tanggal"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                    </div>
                  </div>

                  {/* Email - full width on mobile, 6 cols on desktop */}
                  <div className="md:col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                      placeholder="Masukkan email anda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                  </div>
                </div>

                {/* Third Row - 1 column on mobile, 2 columns on medium+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* No. Reg. MET */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">No. Reg. MET</label>
                    <input type="text" name="noRegMET" value={formData.noRegMET} onChange={handleInputChange}
                      placeholder="Masukkan no. reg anda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                  </div>

                  {/* No. Telp */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">No. Telp</label>
                    <input type="tel" name="noTelp" value={formData.noTelp} onChange={handleInputChange}
                      placeholder="Masukkan no. telp anda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Cards Section - Stacked on mobile, side by side on desktop */}
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
            {/* Bukti Administratif Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">Bukti Administratif</h3>

                {/* Nomor Pokok Wajib Pajak (NPWP) */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nomor Pokok Wajib Pajak (NPWP)
                  </label>
                  <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Upload className="text-gray-400 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">Choose a file or drag & drop it
                          here</p>
                        <p className="text-xs text-gray-500 break-words">JPEG, PNG, PDF, and MP4 formats, up
                          to 50MB</p>
                      </div>
                    </div>
                    <label
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 self-start sm:self-auto cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileChange('npwp')} />
                      Browse File
                    </label>
                    <div className="text-xs text-gray-500 mt-2">
                      {files.npwp ? files.npwp.name : safeGet(assessorDetail, 'tax_id_number') ?
                        safeGet(assessorDetail, 'tax_id_number') : 'Belum ada file terpilih'}
                      {safeGet(assessorDetail, 'tax_id_number') && safeGet(assessorDetail,
                        'tax_id_number').startsWith('http') && (
                          <div><a href={safeGet(assessorDetail, 'tax_id_number')} target="_blank"
                            rel="noreferrer" className="text-blue-600 underline text-xs">Lihat file</a>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Cover Buku Tabungan */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cover Buku Tabungan
                  </label>
                  <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Upload className="text-gray-400 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">Choose a file or drag & drop it
                          here</p>
                        <p className="text-xs text-gray-500 break-words">JPEG, PNG, PDF, and MP4 formats, up
                          to 50MB</p>
                      </div>
                    </div>
                    <label
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 self-start sm:self-auto cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileChange('coverBuku')} />
                      Browse File
                    </label>
                    <div className="text-xs text-gray-500 mt-2">
                      {files.coverBuku ? files.coverBuku.name : safeGet(assessorDetail, 'bank_book_cover') ?
                        safeGet(assessorDetail, 'bank_book_cover') : 'Belum ada file terpilih'}
                      {safeGet(assessorDetail, 'bank_book_cover') && safeGet(assessorDetail,
                        'bank_book_cover').startsWith('http') && (
                          <div><a href={safeGet(assessorDetail, 'bank_book_cover')} target="_blank"
                            rel="noreferrer" className="text-blue-600 underline text-xs">Lihat file</a>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Sertifikat Asesor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sertifikat Asesor
                  </label>
                  <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Upload className="text-gray-400 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">Choose a file or drag & drop it
                          here</p>
                        <p className="text-xs text-gray-500 break-words">JPEG, PNG, PDF, and MP4 formats, up
                          to 50MB</p>
                      </div>
                    </div>
                    <label
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 self-start sm:self-auto cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileChange('sertifikatAsesor')} />
                      Browse File
                    </label>
                    <div className="text-xs text-gray-500 mt-2">
                      {files.sertifikatAsesor ? files.sertifikatAsesor.name : safeGet(assessorDetail,
                        'certificate') ? safeGet(assessorDetail, 'certificate') : 'Belum ada file terpilih'}
                      {safeGet(assessorDetail, 'certificate') && safeGet(assessorDetail,
                        'certificate').startsWith('http') && (
                          <div><a href={safeGet(assessorDetail, 'certificate')} target="_blank" rel="noreferrer"
                            className="text-blue-600 underline text-xs">Lihat file</a></div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kelengkapan Bukti Administratif Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">Kelengkapan Bukti
                  Administratif</h3>

                {/* Pas foto 3 x 4 latar belakang merah */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pas foto 3 x 4 latar belakang merah
                  </label>
                  <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Upload className="text-gray-400 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">Choose a file or drag & drop it
                          here</p>
                        <p className="text-xs text-gray-500 break-words">JPEG, PNG, PDF, and MP4 formats, up
                          to 50MB</p>
                      </div>
                    </div>
                    <label
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 self-start sm:self-auto cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileChange('pasFoto')} />
                      Browse File
                    </label>
                    <div className="text-xs text-gray-500 mt-2">
                      {files.pasFoto ? files.pasFoto.name : 'Belum ada file terpilih'}
                    </div>
                  </div>
                </div>

                {/* Kartu Tanda Penduduk (KTP)/ Kartu keluarga (KK) */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Kartu Tanda Penduduk (KTP)/ Kartu keluarga (KK)
                  </label>
                  <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Upload className="text-gray-400 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">Choose a file or drag & drop it
                          here</p>
                        <p className="text-xs text-gray-500 break-words">JPEG, PNG, PDF, and MP4 formats, up
                          to 50MB</p>
                      </div>
                    </div>
                    <label
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 self-start sm:self-auto cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileChange('ktp')} />
                      Browse File
                    </label>
                    <div className="text-xs text-gray-500 mt-2">
                      {files.ktp ? files.ktp.name : safeGet(assessorDetail, 'national_id') ?
                        safeGet(assessorDetail, 'national_id') : 'Belum ada file terpilih'}
                      {safeGet(assessorDetail, 'national_id') && safeGet(assessorDetail,
                        'national_id').startsWith('http') && (
                          <div><a href={safeGet(assessorDetail, 'national_id')} target="_blank" rel="noreferrer"
                            className="text-blue-600 underline text-xs">Lihat file</a></div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Catatan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Catatan</label>
                  <textarea name="catatan" value={formData.catatan} onChange={handleInputChange}
                    placeholder="Catatan" rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm sm:text-base" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button - Responsive width */}
          <div className="mt-6 flex justify-end">
            <button onClick={handleSubmit} disabled={saving} className={`w-full sm:w-auto sm:px-60 px-8 py-3 ${saving
              ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} text-white font-medium
                    rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500
                    focus:ring-offset-2`}>
              {saving ? 'Menyimpan...' : 'Lanjut'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}