import NavLanding from "../../components/NavLanding";
import FootLanding from "../../components/FootLanding";
import { useState, useEffect } from "react";
import { Link} from 'react-router-dom';

function LandingPage() {
  const images = ["/bgsklh.png", "/bgsklh.png", "/bgsklh.png", "/bgsklh.png"];

const SkemaImages = [
  {
    src: "/img1.png",
    alt: "Junior Assistant Programmer 1",
    h: "Junior Assistent Programer",
    p: "Junior Assistant Programmer adalah posisi entry level di bidang pemrograman, di mana individu membantu programmer senior dalam berbagai tugas pengembangan perangkat lunak"
  },
  {
    src: "/img2.png",
    alt: "Junior Assistant Programmer 2",
    h: "Junior Assistent Programer",
    p: "Junior Assistant Programmer adalah posisi entry level di bidang pemrograman, di mana individu membantu programmer senior dalam berbagai tugas pengembangan perangkat lunak"
  },
  {
    src: "/img3.png",
    alt: "Junior Assistant Programmer 3",
    h: "Junior Assistent Programer",
    p: "Junior Assistant Programmer adalah posisi entry level di bidang pemrograman, di mana individu membantu programmer senior dalam berbagai tugas pengembangan perangkat lunak"
  },
  {
    src: "/img4.png",
    alt: "Junior Assistant Programmer 4",
    h: "Junior Assistent Programer",
    p: "Junior Assistant Programmer adalah posisi entry level di bidang pemrograman, di mana individu membantu programmer senior dalam berbagai tugas pengembangan perangkat lunak"
  },
   {
    src: "/img4.png",
    alt: "Junior Assistant Programmer 4",
    h: "Junior Assistent Programer",
    p: "Junior Assistant Programmer adalah posisi entry level di bidang pemrograman, di mana individu membantu programmer senior dalam berbagai tugas pengembangan perangkat lunak"
  },
   {
    src: "/img4.png",
    alt: "Junior Assistant Programmer 4",
    h: "Junior Assistent Programer",
    p: "Junior Assistant Programmer adalah posisi entry level di bidang pemrograman, di mana individu membantu programmer senior dalam berbagai tugas pengembangan perangkat lunak"
  },
   {
    src: "/img4.png",
    alt: "Junior Assistant Programmer 4",
    h: "Junior Assistent Programer",
    p: "Junior Assistant Programmer adalah posisi entry level di bidang pemrograman, di mana individu membantu programmer senior dalam berbagai tugas pengembangan perangkat lunak"
  },
   {
    src: "/img4.png",
    alt: "Junior Assistant Programmer 4",
    h: "Junior Assistent Programer",
    p: "Junior Assistant Programmer adalah posisi entry level di bidang pemrograman, di mana individu membantu programmer senior dalam berbagai tugas pengembangan perangkat lunak"
  },
];

  // Definisikan tipe props untuk komponen Counter
//   interface CounterProps {
//     target: number;
//     duration?: number;
//   }

//   const Counter = ({ target, duration = 2000 }: CounterProps) => {
//   const [count, setCount] = useState<number>(0);

//   useEffect(() => {
//     let startTime = Date.now();
//     let requestId: number;

//     const updateCounter = () => {
//       const elapsed = Date.now() - startTime;
//       const progress = Math.min(elapsed / duration, 1);
//       setCount(Math.floor(progress * target));

//       if (progress < 1) {
//         requestId = requestAnimationFrame(updateCounter);
//       }
//     };

//     requestId = requestAnimationFrame(updateCounter);

//     return () => cancelAnimationFrame(requestId);
//   }, [target, duration]);

//   return <span>{count}</span>;
// };

const [angle, setAngle] = useState(0);
const radius = 550;
const center = 20;

useEffect(() => {
  const rotationInterval = setInterval(() => {
    setAngle((prev) => prev + 360 / images.length);
  }, 1000); // Durasi rotasi

  return () => clearInterval(rotationInterval);
}, [images.length]); // Tambahkan images.length sebagai dependency
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

            <div className="relative w-[300px] h-[300px] mx-auto mt-10 ">
              <div className="w-[600px] h-[600px] relative mx-50 my-150  rounded-full ">
                {images.map((img, i) => {
                  const theta =
                    ((360 / images.length) * i + angle) * (Math.PI / 180);
                  const x = center + radius * Math.cos(theta) - 40;
                  const y = center + radius * Math.sin(theta) - 40;

                  return (
                    <img
                      key={i}
                      src={img}
                      className={`w-80 h-80 rounded-full absolute transition-all duration-500 ease-in-out
              `}
                      style={{ left: `${x}px`, top: `${y}px` }}
                      alt={`Image ${i}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-orange-500 text-white py-8 px-6 md:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Ayo Tingkatkan Kualitas Skill Anda Bersama Kami
              </h2>
              <p className="text-base md:text-lg opacity-90">
                Sebelum mendaftarkan sertifikasi pastikan anda memiliki akun
                terlebih dahulu
              </p>
            </div>
            <button className="text-white px-4 py-1 border rounded-full">
              Buat Akun Anda
            </button>
          </div>
        </div>

        {/* Tentang LSP */}
        <div className="py-16 px-4 sm:px-6 lg:px-20 bg-gray-50">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Tentang LSP
          </h2>
          <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 text-justify">
            <p className="text-gray-700 mb-4">
              Lembaga Sertifikasi Profesi (LSP) SMKN 24 Jakarta adalah lembaga
              resmi yang berlisensi dari Badan Nasional Sertifikasi Profesi
              (BNSP) yang bertugas melaksanakan uji kompetensi bagi peserta
              didik, alumni, dan masyarakat umum. LSP ini dibentuk sebagai wujud
              komitmen SMKN 24 Jakarta dalam mencetak lulusan yang memiliki
              keterampilan, pengetahuan, dan sikap kerja sesuai standar nasional
              maupun internasional. Dengan adanya sertifikasi kompetensi,
              lulusan SMKN 24 Jakarta memiliki bukti pengakuan yang sah bahwa
              mereka siap bersaing di dunia kerja.
            </p>
            <p className="text-gray-700 mb-4">
              LSP SMKN 24 Jakarta didukung oleh fasilitas uji yang memadai serta
              asesor kompetensi yang telah tersertifikasi BNSP. Proses
              sertifikasi dilaksanakan secara objektif, transparan, dan mengacu
              pada skema kompetensi yang sesuai dengan kebutuhan dunia usaha dan
              dunia industri (DUDI). Selain itu, LSP ini juga menjalin kerjasama
              dengan berbagai pihak untuk memastikan setiap kompetensi yang
              diuji relevan dengan perkembangan teknologi dan tuntutan pasar
              kerja.
            </p>
            <p className="text-gray-700 mb-6">
              Keberadaan LSP SMKN 24 Jakarta menjadi salah satu keunggulan
              sekolah dalam mempersiapkan tenaga kerja profesional dan kompeten.
              Dengan sertifikat kompetensi yang diakui secara nasional, peserta
              didik dan lulusan memiliki nilai tambah yang lebih tinggi di mata
              industri. Hal ini sejalan dengan visi LSP SMKN 24 Jakarta untuk
              menjadi lembaga sertifikasi profesi yang unggul, terpercaya, dan
              mampu menghasilkan SDM yang berdaya saing di era globalisasi.
            </p>
            <a href="#" className="text-blue-500 hover:underline font-medium">
              Selengkapnya
            </a>
          </div>
        </div>

                <div className="bg-orange-500 text-white py-8 px-6 md:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center px-6">
            <div className="text-center md:text-center mb-4 md:mb-0">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                {/* <Counter target={1999} /> */} 199
              </h2>
              <p className="text-base md:text-lg opacity-90">Jumlah Asesi</p>
            </div>
            <div className="text-center md:text-center mb-4 md:mb-0">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                {/* <Counter target={19} /> */} 19
              </h2>
              <p className="text-base md:text-lg opacity-90">Jumlah Asesi</p>
            </div>
            <div className="text-center md:text-center mb-4 md:mb-0">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                {/* <Counter target={1999} /> */} 1999
              </h2>
              <p className="text-base md:text-lg opacity-90">Jumlah Asesi</p>
            </div>
            <div className="text-center md:text-center mb-4 md:mb-0">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                {/* <Counter target={1999} /> */} 9
              </h2>
              <p className="text-base md:text-lg opacity-90">Jumlah Asesi</p>
            </div>
          </div>
        </div>

  <div className="py-16 px-6 bg-white">
      <p className="text-2xl font-bold text-start">Skema Sertifikasi</p>
      <h2 className="text-2xl font-bold text-start mb-10">Daftar Skema Sertifikasi</h2>
      
      <div className="mb-10">
        <Link 
          to="/skema" 
          className="text-orange-500 border-2 border-orange-500 py-2 px-6 rounded-full hover:bg-orange-500 hover:text-white transition"
        >
          Lihat Semua Skema
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
  {SkemaImages.map((item, index) => (
    <div
      key={index}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden animate-fade-in-up transform hover:-translate-y-2"
    >
      <div className="relative aspect-[4/3] w-full flex items-center justify-center text-6xl overflow-hidden">
        <img
          src={item.src}
          alt={item.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay hover */}
        
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {item.h}
        </h3>
        <p className="text-gray-600 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {item.p}
        </p>
        <a
          href="/skema"
          className="text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-blue-800"
        >
          Detail →
        </a>
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
