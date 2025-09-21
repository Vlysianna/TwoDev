import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FileText, Upload, AlertCircle } from 'lucide-react';
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
    tempatLahir: '',
    tanggalLahir: '',
    email: '',
    noRegMET: '',
    noTelp: '',
    catatan: '',
    kompetensiKeahlian: '',
    asalLSP: ''
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    tax_id_number: null,        // NPWP
    bank_book_cover: null,      // Cover Buku Tabungan
    certificate: null,          // Sertifikat Asesor
    id_card: null,              // Pas Foto
    national_id: null           // KTP/KK
  });

  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshBiodataCheck } = useBiodataCheck();
  const [assessor, setAssessor] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  const [schemes, setSchemes] = useState<any[]>([]);

  const safeGet = (obj: Record<string, unknown> | null, key: string) => {
    if (!obj) return '';
    const v = obj[key];
    if (v === undefined || v === null) return '';
    return String(v);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (fileType: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));

      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreviews(prev => ({
          ...prev,
          [fileType]: previewUrl
        }));
      }
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        try {
          const schemesResp = await api.get('/schemes');
          if (schemesResp.data?.success) {
            setSchemes(schemesResp.data.data);
          }
        } catch (error) {
          console.error('Error loading schemes:', error);
        }

        // get assessor by user id
        const resp = await api.get(`/assessor/user/${user.id}`);
        if (resp.data?.success) {
          setAssessor(resp.data.data);

          // Set file previews from existing data
          if (resp.data.data.detail) {
            setFilePreviews({
              tax_id_number: resp.data.data.detail.tax_id_number || '',
              bank_book_cover: resp.data.data.detail.bank_book_cover || '',
              certificate: resp.data.data.detail.certificate || '',
              id_card: resp.data.data.detail.id_card || '',
              national_id: resp.data.data.detail.national_id || ''
            });
          }

          // Load additional data from localStorage
          const savedAdditionalData = localStorage.getItem(`assessor_additional_${user.id}`);
          let catatan = '';
          if (savedAdditionalData) {
            try {
              const additionalData = JSON.parse(savedAdditionalData);
              catatan = additionalData.catatan || '';
            } catch {
              // ignore parsing errors
            }
          }

          setFormData(prev => ({
            ...prev,
            nama: safeGet(resp.data.data, 'name') || user?.full_name || prev.nama || '',
            email: user?.email || prev.email || '',
            alamat: safeGet(resp.data.data, 'address') || prev.alamat || '',
            tanggalLahir: safeGet(resp.data.data, 'birth_date') || prev.tanggalLahir || '',
            tempatLahir: safeGet(resp.data.data, 'birth_location') || prev.tempatLahir || '',
            noRegMET: safeGet(resp.data.data, 'no_reg_met') || prev.noRegMET || '',
            noTelp: safeGet(resp.data.data, 'phone_no') || prev.noTelp || '',
            kompetensiKeahlian: safeGet(resp.data.data.scheme, 'id') || prev.kompetensiKeahlian || '',
            asalLSP: safeGet(resp.data.data, 'institution') || prev.asalLSP || '',
            catatan: catatan || prev.catatan || ''
          }));
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.error('Authentication failed - redirecting to login');
          navigate('/login');
          return;
        } else if (error.response?.status === 404) {
          // New user without assessor data - pre-fill with user data
          setFormData(prev => ({
            ...prev,
            nama: user.full_name || prev.nama || '',
            email: user.email || prev.email || '',
          }));
        } else {
          console.error('Error loading assessor data:', error);
        }
      }

      setInitialLoading(false);
    };

    load();
  }, [user]);

  // Check for redirect message
  useEffect(() => {
    if (location.state && (location.state as any).message) {
      setRedirectMessage((location.state as any).message);
      const timer = setTimeout(() => {
        setRedirectMessage(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const REQUIRED_FIELDS = [
    'nama',
    'alamat',
    'tempatLahir',
    'tanggalLahir',
    'email',
    'noRegMET',
    'noTelp',
    'kompetensiKeahlian',
    'asalLSP'
  ];

  const OPTIONAL_FIELDS = [
    'catatan'
  ];

  const isFormValid = () => {
    return REQUIRED_FIELDS.every(field => formData[field].trim() !== '');
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    // Validasi kolom wajib
    if (!isFormValid()) {
      setErrorMessage('Mohon lengkapi semua kolom yang wajib diisi.');
      setSaving(false);
      return;
    }

    // Isi otomatis kolom opsional jika kosong
    const filledFormData = { ...formData };
    OPTIONAL_FIELDS.forEach(field => {
      if (!filledFormData[field] || filledFormData[field].trim() === '') {
        filledFormData[field] = '-';
      }
    });

    try {
      // 1) Prepare FormData dengan semua field dan file
      const formDataToSend = new FormData();

      // Append semua file ke FormData
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
        }
      });

      // Append semua data form ke FormData
      formDataToSend.append('user_id', user.id.toString());
      formDataToSend.append('scheme_id', filledFormData.kompetensiKeahlian);
      formDataToSend.append('name', filledFormData.nama);
      formDataToSend.append('birth_location', filledFormData.tempatLahir);
      formDataToSend.append('birth_date', filledFormData.tanggalLahir);
      formDataToSend.append('no_reg_met', filledFormData.noRegMET);
      formDataToSend.append('institution', filledFormData.asalLSP);
      formDataToSend.append('address', filledFormData.alamat);
      formDataToSend.append('phone_no', filledFormData.noTelp);
      formDataToSend.append('catatan', filledFormData.catatan);

      // 2) Create or update assessor menggunakan endpoint /assessor
      let response;
      if (assessor?.id) {
        // Update existing assessor
        response = await api.post(`/assessor/${assessor.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new assessor
        response = await api.post('/assessor', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data?.success) {
        setAssessor(response.data.data);

        // Save additional data to localStorage
        const additionalData = {
          catatan: filledFormData.catatan
        };
        localStorage.setItem(`assessor_additional_${user.id}`, JSON.stringify(additionalData));

        setSuccessMessage('Data berhasil disimpan');
        await refreshBiodataCheck();

        if (location.state && (location.state as any).from) {
          setTimeout(() => {
            navigate((location.state as any).from, { replace: true });
          }, 2000);
        } else {
          setTimeout(() => {
            navigate(paths.asesor.dashboardAsesor, { replace: true });
          }, 2000);
        }
      } else {
        setErrorMessage('Gagal menyimpan data');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  // Render UI
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
          <NavbarAsesor title="Biodata Asesor" icon={<FileText size={25} />} />
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
                  {!assessor ? (
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
                    <label className="block text-sm font-medium text-red-500 mb-2 italic">*Kolom nama wajib diisi</label>
                  </div>

                  {/* Alamat */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                    <input type="text" name="alamat" value={formData.alamat} onChange={handleInputChange}
                      placeholder="Masukkan alamat anda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                    <label className="block text-sm font-medium text-red-500 mb-2 italic">*Kolom alamat wajib diisi</label>
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
                    <label className="block text-sm font-medium text-red-500 mb-2 italic">*Kolom tempat lahir wajib diisi</label>
                  </div>

                  {/* Pilih tanggal - full width on mobile, 2 cols on desktop */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih tanggal</label>
                    <div className="relative">
                      <input type="date" name="tanggalLahir" value={formData.tanggalLahir}
                        onChange={handleInputChange} placeholder="Pilih tanggal"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                      <label className="block text-sm font-medium text-red-500 mb-2 italic">*Kolom tanggal lahir wajib diisi</label>
                    </div>
                  </div>

                  {/* Email - full width on mobile, 6 cols on desktop */}
                  <div className="md:col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                      placeholder="Masukkan email anda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                    <label className="block text-sm font-medium text-red-500 mb-2 italic">*Kolom email wajib diisi</label>
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
                    <label className="block text-sm font-medium text-red-500 mb-2 italic">*Kolom No. Reg. MET wajib diisi, contoh <span className='text-blue-500 underline'>MET.000.71824.2025</span></label>
                  </div>

                  {/* No. Telp */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">No. Telp</label>
                    <input type="tel" name="noTelp" value={formData.noTelp} onChange={handleInputChange}
                      placeholder="Masukkan no. telp anda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                    <label className="block text-sm font-medium text-red-500 mb-2 italic">*Kolom No. Telp wajib diisi</label>
                  </div>
                </div>

                {/* Third Row - 1 column on mobile, 2 columns on medium+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Kompetensi Keahlian */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kompetensi Keahlian</label>
                    <select
                      name="kompetensiKeahlian"
                      value={formData.kompetensiKeahlian}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    >
                      <option value="">Pilih Kompetensi Keahlian</option>
                      {schemes.map((scheme) => (
                        <option key={scheme.id} value={scheme.id}>
                          {scheme.code} - {scheme.name}
                        </option>
                      ))}
                    </select>
                    <label className="block text-sm font-medium text-red-500 mb-2 italic">*Kolom Kompetensi Keahlian wajib diisi</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Asal LSP</label>
                    <input type="text" name="asalLSP" value={formData.asalLSP} onChange={handleInputChange}
                      placeholder="Masukkan asal LSP anda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base" />
                    <label className="block text-sm font-medium text-red-500 mb-2 italic">*Kolom Asal LSP wajib diisi</label>
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Upload className="text-gray-400 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">Pilih file atau drag & drop di sini</p>
                        <p className="text-xs text-gray-500 break-words">JPEG, PNG, dan PDF, maksimal 5MB</p>
                      </div>
                    </div>
                    <label className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 self-start sm:self-auto cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileChange('tax_id_number')} accept=".jpg,.jpeg,.png,.pdf" />
                      Pilih File
                    </label>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {files.tax_id_number ? files.tax_id_number.name : filePreviews.tax_id_number ?
                      <a href={filePreviews.tax_id_number} target="_blank" rel="noreferrer" className="text-blue-600 underline">Lihat file terupload</a> :
                      'Belum ada file terpilih'}
                  </div>
                </div>

                {/* Cover Buku Tabungan */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cover Buku Tabungan
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Upload className="text-gray-400 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">Pilih file atau drag & drop di sini</p>
                        <p className="text-xs text-gray-500 break-words">JPEG, PNG, PDF, maksimal 50MB</p>
                      </div>
                    </div>
                    <label className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 self-start sm:self-auto cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileChange('bank_book_cover')} accept=".jpg,.jpeg,.png,.pdf" />
                      Pilih File
                    </label>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {files.bank_book_cover ? files.bank_book_cover.name : filePreviews.bank_book_cover ?
                      <a href={filePreviews.bank_book_cover} target="_blank" rel="noreferrer" className="text-blue-600 underline">Lihat file terupload</a> :
                      'Belum ada file terpilih'}
                  </div>
                </div>

                {/* Sertifikat Asesor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sertifikat Asesor
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Upload className="text-gray-400 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">Pilih file atau drag & drop di sini</p>
                        <p className="text-xs text-gray-500 break-words">JPEG, PNG, PDF, maksimal 50MB</p>
                      </div>
                    </div>
                    <label className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 self-start sm:self-auto cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileChange('certificate')} accept=".jpg,.jpeg,.png,.pdf" />
                      Pilih File
                    </label>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {files.certificate ? files.certificate.name : filePreviews.certificate ?
                      <a href={filePreviews.certificate} target="_blank" rel="noreferrer" className="text-blue-600 underline">Lihat file terupload</a> :
                      'Belum ada file terpilih'}
                  </div>
                </div>
              </div>
            </div>

            {/* Kelengkapan Bukti Administratif Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">Kelengkapan Bukti Administratif</h3>

                {/* Pas foto 3 x 4 latar belakang merah */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pas foto 3 x 4 latar belakang merah
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Upload className="text-gray-400 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">Pilih file atau drag & drop di sini</p>
                        <p className="text-xs text-gray-500 break-words">JPEG, PNG, maksimal 5MB</p>
                      </div>
                    </div>
                    <label className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 self-start sm:self-auto cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileChange('id_card')} accept=".jpg,.jpeg,.png" />
                      Pilih File
                    </label>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {files.id_card ? files.id_card.name : filePreviews.id_card ?
                      <a href={filePreviews.id_card} target="_blank" rel="noreferrer" className="text-blue-600 underline">Lihat file terupload</a> :
                      'Belum ada file terpilih'}
                  </div>
                </div>

                {/* Kartu Tanda Penduduk (KTP)/ Kartu keluarga (KK) */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Kartu Tanda Penduduk (KTP)/ Kartu keluarga (KK)
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Upload className="text-gray-400 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">Pilih file atau drag & drop di sini</p>
                        <p className="text-xs text-gray-500 break-words">JPEG, PNG, PDF, maksimal 50MB</p>
                      </div>
                    </div>
                    <label className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 self-start sm:self-auto cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileChange('national_id')} accept=".jpg,.jpeg,.png,.pdf" />
                      Pilih File
                    </label>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {files.national_id ? files.national_id.name : filePreviews.national_id ?
                      <a href={filePreviews.national_id} target="_blank" rel="noreferrer" className="text-blue-600 underline">Lihat file terupload</a> :
                      'Belum ada file terpilih'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button - Responsive width */}
          <div className="mt-6 flex justify-end">
            <button onClick={handleSubmit} disabled={saving} className={`w-full sm:w-auto sm:px-60 px-8 py-3 cursor-pointer ${saving
              ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#E77D35] hover:bg-orange-600'} text-white font-medium
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