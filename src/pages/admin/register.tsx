import { useState } from 'react';
import Navbar from '../../components/NavAdmin';
import Sidebar from '../../components/SideAdmin';
import { Eye, EyeIcon} from "lucide-react";
import { EyeSlashIcon } from "@heroicons/react/24/outline";


export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <>
    <div className="flex min-h-screen bg-gray-50">

      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0 md:ml-0">
        {/* Navbar - Sticky di atas */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <Navbar />
        </div>

        {/* Konten Utama */}
        <div className="p-6">
          {/* Konten Utama ya buyunggggggggggggggggggggggggg */}
      {/* Konten utama */}
       <main className=" ">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-2">
          Dashboard / Register
        </div>

        {/* Judul Halaman */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Buat Akun</h1>
       

        {/* Tabel Register */}
        <main className="max-w-4xl mx-auto bg-white p-6 ">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 mt-8">Registrasi</h1>
      <hr />
      <br />

      <form className="space-y-8">
        {/* Email & Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan email anda" />
            <p className="text-xs text-red-500 mt-1 italic">*wajib diisi</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative w-ful">
                 <input type={showPassword ? "text" : "password"} className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400 pr-10" placeholder= "Masukkan password anda" 
            />
              <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 mb-4"
      >
        {showPassword ? (
          <EyeIcon className="5-6 h-5" />
        ) : (
          <EyeSlashIcon className="w-5 h-5" />
        )}
      </button>
       <p className="text-xs text-red-500 mt-1 italic">*wajib diisi</p>

            </div>
          </div>
        </div>

        {/* Data Pribadi */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Data Pribadi</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan nama anda" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. KTP/NIK/Paspor</label>
              <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan nomor identitas anda" />
            </div>
             <div>
              <label className="block text-sm font-medium mb-1">Tempat Lahir</label>
              <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder='Masukkan tempat lahir anda' />
            </div>
             <div>
              <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="gender" className="text-orange-500" />
                  <span className="ml-2">Laki-laki</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="gender" className="text-orange-500" />
                  <span className="ml-2">Perempuan</span>
                </label>
              </div>
            </div>
            <div>
                <label className="block text-sm font-medium ">Select Date</label>
                <input type="date" name="date" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Select Birth  Date"/>
                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">           
                </div>
            </div>
               <div>
                <label className="block text-sm font-medium mb-1">No. Telp Kantor</label>
                <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan no. telp kantor anda" />
              </div>
           <div>
              <label className="block text-sm font-medium mb-1">Kewarganegaraan</label>
              <select className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400">
                <option value="">Masukkan negara anda</option>
              </select>
            </div>
              <div>
                <label className="block text-sm font-medium mb-1">No. Telp Rumah</label>
                <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan no. telp rumah anda" />
              </div>
              <div>
              <label className="block text-sm font-medium mb-1">Provinsi</label>
              <select className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400">
                <option value="">Masukkan provinsi anda</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">No. Hp</label>
              <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan no. hp anda" />
            </div>
             <div>
              <label className="block text-sm font-medium mb-1">Kota</label>
              <select className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400">
                <option value="">Masukkan kota anda</option>
              </select>
            </div>
              <div>
              <label className="block text-sm font-medium mb-1">Kode Pos</label>
              <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan kode pos anda" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alamat</label>
              <input type="tel" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan alamat anda" />
            </div>
          </div>
        </section>

        {/* Data Pekerjaan */}
         <hr />
        <section>
          <h2 className="text-lg font-semibold mb-4">Data Pekerjaan</h2>
         

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Instansi / Perusahaan</label>
              <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan nama instansi atau perusahaan anda" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. Telp Rumah</label>
              <input type="tel" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan no. telp rumah anda" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bidang Pekerjaan</label>
              <select className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400">
                <option value="">Masukkan bidang anda</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium mb-1">No. Telp Kantor</label>
              <input type="tel" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan no. telp kantor anda" />
            </div>
             <div>
              <label className="block text-sm font-medium mb-1">Jabatan</label>
              <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan jabatan anda" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Alamat Kantor</label>
              <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan alamat kantor anda" />
            </div>
               <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan Email kantor anda" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Kode Pos</label>
              <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan kode pos kantor anda" />
            </div>
          </div>
        </section>

        {/* Kualifikasi Pendidikan */}
        <hr />
        <section>
          <h2 className="text-lg font-semibold mb-4">Kualifikasi Pendidikan</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Jenjang Pendidikan</label>
              <select className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400">
                <option value="">Jenjang pendidikan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tahun Lulus</label>
              <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan tahun lulus anda" />
            </div>
             <div>
              <label className="block text-sm font-medium mb-1">Instansi</label>
              <input type="text" className="w-full border rounded p-2 font-normal text-gray-600 placeholder-gray-400" placeholder="Masukkan instansi anda" />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="text-right">
          <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">
            Submit
          </button>
        </div>
      </form>
    </main>
      </main>
        </div>
      </div>

    </div>
    </>
  );
}
