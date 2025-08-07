import NavLanding from '../../components/NavLanding';
import FootLanding from '../../components/FootLanding';
import { useState } from 'react';



function LandingPage() {
  const beritaImages = [
    { src: '/bgsklh.png', alt: 'Berita 1' },
    { src: '/bgsklh.png', alt: 'Berita 2' },
    { src: '/bgsklh.png', alt: 'Berita 3' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <NavLanding />

      <main className="relative flex-1">
        {/* Hero Section */}
        <div className="relative h-[90vh] w-full overflow-hidden">
          <img
            src="/bgsklh.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover blur-sm brightness-75 z-0"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20 h-full">
            <div className="text-white max-w-xl text-center md:text-left">
              <p className="text-xl md:text-2xl mb-4">
                Lembaga Sertifikasi Profesi SMKN 24 Jakarta
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Sertifikasikan <br /> Profesimu!
              </h1>
            </div>

            <div className="w-full md:w-[500px] h-[200px] md:h-[300px] bg-gray-300 rounded-lg shadow-lg mt-10 md:mt-0" />
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-orange-500 text-white py-8 px-6 md:px-20">
          <div className="flex flex-col items-start text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Ayo Tingkatkan Kualitas Skill Anda Bersama Kami
            </h2>
            <p className="text-base md:text-lg opacity-90">
              Sebelum mendaftarkan sertifikasi pastikan anda memiliki akun terlebih dahulu
            </p>
          </div>
        </div>

        {/* Tentang LSP */}
        <div className="py-16 px-4 sm:px-6 lg:px-20 bg-gray-50">
          <h2 className="text-2xl font-semibold text-center mb-10">Tentang LSP</h2>

          <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 text-justify">
            <p className="text-gray-700 mb-4">
              Lembaga Sertifikasi Profesi (LSP) SMKN 24 Jakarta adalah lembaga resmi yang berlisensi dari Badan Nasional Sertifikasi Profesi (BNSP) yang bertugas melaksanakan uji kompetensi bagi peserta didik, alumni, dan masyarakat umum. LSP ini dibentuk sebagai wujud komitmen SMKN 24 Jakarta dalam mencetak lulusan yang memiliki keterampilan, pengetahuan, dan sikap kerja sesuai standar nasional maupun internasional. Dengan adanya sertifikasi kompetensi, lulusan SMKN 24 Jakarta memiliki bukti pengakuan yang sah bahwa mereka siap bersaing di dunia kerja.
            </p>
            <p className="text-gray-700 mb-4">
              LSP SMKN 24 Jakarta didukung oleh fasilitas uji yang memadai serta asesor kompetensi yang telah tersertifikasi BNSP. Proses sertifikasi dilaksanakan secara objektif, transparan, dan mengacu pada skema kompetensi yang sesuai dengan kebutuhan dunia usaha dan dunia industri (DUDI). Selain itu, LSP ini juga menjalin kerjasama dengan berbagai pihak untuk memastikan setiap kompetensi yang diuji relevan dengan perkembangan teknologi dan tuntutan pasar kerja.
            </p>
            <p className="text-gray-700 mb-6">
              Keberadaan LSP SMKN 24 Jakarta menjadi salah satu keunggulan sekolah dalam mempersiapkan tenaga kerja profesional dan kompeten. Dengan sertifikat kompetensi yang diakui secara nasional, peserta didik dan lulusan memiliki nilai tambah yang lebih tinggi di mata industri. Hal ini sejalan dengan visi LSP SMKN 24 Jakarta untuk menjadi lembaga sertifikasi profesi yang unggul, terpercaya, dan mampu menghasilkan SDM yang berdaya saing di era globalisasi.
            </p>
            <a href="#" className="text-blue-500 hover:underline font-medium">
              Selengkapnya
            </a>
          </div>
        </div>

        {/* Berita Terbaru */}
        <div className="py-16 px-4 bg-white">
          <h2 className="text-2xl font-bold text-center mb-10">Berita Terbaru LSP</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
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

                {/* Logo on hover */}
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white to-transparent flex items-end justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <img
                    src="/twodev-teks.svg"
                    alt="Wodev"
                    className="h-6 w-auto mb-4 ml-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <FootLanding />
    </div>
  );
}

export default LandingPage;
