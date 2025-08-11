import { useEffect, useState } from "react";
import FootLanding from "../../components/FootLanding";
import NavLanding from "../../components/NavLanding";

function TentangLSP() {
   interface CounterProps {
    target: number;
    duration?: number;
  }
   const Counter = ({ target, duration = 3000 }: CounterProps) => {
    const [count, setCount] = useState<number>(0);
  
    useEffect(() => {
      let startTime = Date.now();
      let requestId: number;
  
      const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setCount(Math.floor(progress * target));
  
        if (progress < 1) {
          requestId = requestAnimationFrame(updateCounter);
        }
      };
  
      requestId = requestAnimationFrame(updateCounter);
  
      return () => cancelAnimationFrame(requestId);
    }, [target, duration]);
  
    return <span>{count}</span>;
  };
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavLanding />        

        
           <section className="relative min-h-screen">
          <img
            src="/bgsklh.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-[3px] brightness-100 z-0"
          />
                <div className="absolute inset-0 bg-[#3171cd] opacity-55 mix-blend-multiply "></div>
          <div className="relative z-10 flex items-center justify-center text-center px-4 sm:px-10 md:px-20 py-32 sm:py-40 h-full">
            <div className="text-white max-w-2xl">
              <h1 className="text-1xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4">
                Lembaga Sertifikasi Profesi SMK Negeri 24 Jakarta
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl leading-tight">
                Profil Singkat/ Visi/ Misi/ Moto
              </p>
            </div>
          </div>
        </section>
<main className="flex-grow bg-gray-50">
          {/* Tentang LSP dengan gambar di kiri */}        
          <div className="max-w-6xl mx-auto py-16 px-4 sm:px-8 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Gambar kiri */}
              <div className="w-full h-full">
                <img
                  src="/bgsklh.png"
                  alt="Gedung SMKN 24 Jakarta"
                  className="rounded-lg shadow-lg aspect-square object-cover"
                />
              </div>
              {/* Orange overlay */}

              {/* Teks kanan */}
              <div>
                <h2 className="text-sm font-semibold text-gray-600 border-b border-gray-300 mb-8">
                  Profile
                </h2>
                <h2 className="text-2xl font-semibold mb-4">Tentang LSP SMKN 24 Jakarta</h2>
                <p className="text-gray-700 mb-4">
                  Lembaga Sertifikasi Profesi (LSP) SMKN 24 Jakarta adalah lembaga resmi yang
                  berlisensi dari Badan Nasional Sertifikasi Profesi (BNSP) yang bertugas melaksanakan uji
                  kompetensi bagi peserta didik, alumni, dan masyarakat umum. LSP ini dibentuk sebagai wujud
                  komitmen SMKN 24 Jakarta dalam mencetak lulusan yang memiliki keterampilan, pengetahuan, dan
                  sikap kerja sesuai standar nasional maupun internasional.
                </p>
                <p className="text-gray-700 mb-4">
                  LSP SMKN 24 Jakarta didukung oleh fasilitas uji yang memadai serta asesor kompetensi yang
                  telah tersertifikasi BNSP. Proses sertifikasi dilaksanakan secara objektif, transparan, dan
                  mengacu pada skema kompetensi yang sesuai dengan kebutuhan dunia usaha dan dunia industri
                  (DUDI).
                </p>
              </div>
            </div>
          </div>

      

          {/* Visi Misi Moto */}
          <div className="bg-white py-12">
            <div className="max-w-6xl mx-auto mb-15">
              <h2 className="text-sm font-semibold text-gray-600 border-b border-gray-300 mb-8">
                Visi, Misi & Moto
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Visi */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Visi</h3>
                  <p className="text-gray-700 text-justify">
                    Menjadi LSP yang unggul, terpercaya, dan berdaya saing dalam mencetak
                    sumber daya manusia yang kompeten, profesional, serta mampu memenuhi
                    kebutuhan dunia kerja.
                  </p>
                </div>

                {/* Misi */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Misi</h3>
                  <ol className="list-decimal list-inside text-gray-700 space-y-1 text-justify">
                    <li>Menyelenggarakan sertifikasi kompetensi secara profesional, objektif, dan sesuai standar BNSP.</li>
                    <li>Membina dan meningkatkan kapasitas asesor kompetensi agar mampu memberikan penilaian yang berkualitas.</li>
                    <li>Memperkuat kerjasama dengan dunia usaha, dunia industri, serta instansi terkait dalam mendukung terserapnya tenaga kerja kompeten.</li>
                    <li>Memberikan layanan sertifikasi yang terjangkau, transparan, dan bermanfaat bagi peserta didik, alumni, maupun masyarakat umum.</li>
                    <li>Mendorong lulusan memiliki sertifikat kompetensi sebagai bekal memasuki dunia kerja.</li>
                  </ol>
                </div>

                {/* Moto */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Moto</h3>
                  <ol className="list-decimal list-inside text-gray-700 space-y-1 text-justify">
                    <li>Kompeten, Profesional, Siap Bersaing</li>
                    <li>Mewujudkan SDM Unggul dengan Sertifikasi Kompetensi</li>
                    <li>Standar Nasional, Kualitas Global</li>
                    <li>Mencetak Tenaga Kerja Tersertifikasi dan Berdaya Saing</li>
                    <li>Kompetensi Teruji, Masa Depan Pasti</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

<div className="relative py-8 px-6 md:px-20 text-white">
  {/* Background Image with Orange Overlay */}
  <div className="absolute inset-0 z-0 overflow-hidden">
    <img 
      src="/bgsklh.png" 
      alt="Background"
      className="w-full h-full object-cover brightness-80"
    />
    {/* Orange overlay */}
    <div className="absolute inset-0 bg-[#E77D35] opacity-80 mix-blend-multiply"></div>
  </div>
  
  {/* Counter Content */}
  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center px-6">
    <div className="text-center md:text-center mb-4 md:mb-0">
      <h2 className="text-xl md:text-2xl font-bold mb-2">
        <Counter target={1999} />
      </h2>
      <p className="text-base md:text-lg opacity-90">Jumlah Asesi</p>
    </div>
    <div className="text-center md:text-center mb-4 md:mb-0">
      <h2 className="text-xl md:text-2xl font-bold mb-2">
        <Counter target={19} /> 
      </h2>
      <p className="text-base md:text-lg opacity-90">Jumlah Asesor</p>
    </div>
    <div className="text-center md:text-center mb-4 md:mb-0">
      <h2 className="text-xl md:text-2xl font-bold mb-2">
        <Counter target={1999} /> 
      </h2>
      <p className="text-base md:text-lg opacity-90">Skema Sertifikasi</p>
    </div>
    <div className="text-center md:text-center mb-4 md:mb-0">
      <h2 className="text-xl md:text-2xl font-bold mb-2">
        <Counter target={1999} /> 
      </h2>
      <p className="text-base md:text-lg opacity-90">Tuk Terlatih</p>
    </div>
  </div>
</div>
        

          
        </main>

        <FootLanding />
      </div>
    </>
  );
}

export default TentangLSP;