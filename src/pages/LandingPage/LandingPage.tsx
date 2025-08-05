import NavLanding from '../../components/NavLanding'
import FootLanding from '../../components/FootLanding'
import { useState } from 'react';


function LandingPage() {
  const beritaImages = [
    { src: "/bgsklh.png", alt: "Berita 1" },
    { src: "/bgsklh.png", alt: "Berita 2" },
    { src: "/bgsklh.png", alt: "Berita 3" },
  ];
  const [activeItem, setActiveItem] = useState<string>('Home');

  return (
    <>
    <div className="flex flex-col min-h-screen">
  <NavLanding />  
 <main className="min-h-screen">            
  <img src="/bgsklh.png" alt="" className='absolute inset-0 w-full h-full object-cover blur-sm brightness-75 z-0'/>

  <div className="relative z-10 flex items-center justify-between px-20 py-40 h-full">
    <div className="text-white max-w-xl">
      <p className="text-2xl mb-4">Lembaga Sertifikasi Profesi SMKN 24 Jakarta</p>
      <h1 className="text-6xl font-extrabold leading-tight">
        Sertifikasikan <br />
        Profesimu!
      </h1>
    </div>
    
    <div className="w-[500px] h-[300px] bg-gray-300 rounded-lg shadow-lg"></div>
  </div>

  <div className="relative z-10 w-full bg-orange-500 text-white py-8 px-8 lg:px-20">
    <div className="flex flex-col lg:flex-row items-center justify-between">
      <div className="mb-4 lg:mb-0">
        <h2 className="text-xl lg:text-2xl font-bold mb-2">
          Ayo Tingkatkan Kualitas Skill Anda Bersama Kami
        </h2>
        <p className="text-lg opacity-90">
          Sebelum mendaftarkan sertifikasi pastikan anda memiliki akun terlebih dahulu
        </p>
      </div>           
    </div>
  </div>

  <div className="text-center flex items-center justify-center py-16">
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8 text-start">
    <h2 className="text-2xl font-semibold text-center mb-6">Tentang LSP</h2>  
     <p className="text-black-700 mb-4">
          Lembaga Sertifikasi Profesi (LSP) SMKN 24 Jakarta adalah lembaga resmi yang berlisensi dari Badan Nasional Sertifikasi Profesi (BNSP) yang bertugas melaksanakan uji kompetensi bagi peserta didik, alumni, dan masyarakat umum. LSP ini dibentuk sebagai wujud komitmen SMKN 24 Jakarta dalam mencetak lulusan yang memiliki keterampilan, pengetahuan, dan sikap kerja sesuai standar nasional maupun internasional. Dengan adanya sertifikasi kompetensi, lulusan SMKN 24 Jakarta memiliki bukti pengakuan yang sah bahwa mereka siap bersaing di dunia kerja.
        </p>
        <p className="text-black-700 mb-4">
          LSP SMKN 24 Jakarta didukung oleh fasilitas uji yang memadai serta asesor kompetensi yang telah tersertifikasi BNSP. Proses sertifikasi dilaksanakan secara objektif, transparan, dan mengacu pada skema kompetensi yang sesuai dengan kebutuhan dunia usaha dan dunia industri (DUDI). Selain itu, LSP ini juga menjalin kerjasama dengan berbagai pihak untuk memastikan setiap kompetensi yang diuji relevan dengan perkembangan teknologi dan tuntutan pasar kerja.
        </p>
        <p className="text-black-700 mb-6">
          Keberadaan LSP SMKN 24 Jakarta menjadi salah satu keunggulan sekolah dalam mempersiapkan tenaga kerja profesional dan kompeten. Dengan sertifikat kompetensi yang diakui secara nasional, peserta didik dan lulusan memiliki nilai tambah yang lebih tinggi di mata industri. Hal ini sejalan dengan visi LSP SMKN 24 Jakarta untuk menjadi lembaga sertifikasi profesi yang unggul, terpercaya, dan mampu menghasilkan SDM yang berdaya saing di era globalisasi.
        </p>
        <a href="#" className="text-blue-500 hover:underline font-medium">
          Selengkapnya
        </a>
    </div>
  </div>

  <div className="py-16 px-4 bg-white">
    <h2 className="text-2xl font-bold text-center mb-10">Berita Terbaru LSP</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 max-w-6xl mx-auto">
        {beritaImages.map((item, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl shadow-md group"
          >
            <div className="aspect-[3/4] w-full">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Logo saat hover */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white to-transparent flex items-end justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
  <img 
    src="/TwodevTeks.png" 
    alt="Wodev" 
    className="h-6 w-auto mb-4 ml-4"  // mb-4 dan ml-4 untuk memberi jarak dari tepi
  />
</div>
          </div>
        ))}
      </div>
  </div>
</main>

  <FootLanding />
</div>
    </>
  )
}

export default LandingPage
