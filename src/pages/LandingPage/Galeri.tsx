import FootLanding from "../../components/FootLanding";
import NavLanding from "../../components/NavLanding";
import { Image as ImageIcon } from "lucide-react"; // ikon placeholder
import { getAssetPath } from '@/utils/assetPath';

function Galeri() {
  // Data gambar bisa diganti di sini
  const galeriImages = [
    { src: getAssetPath('/bgsklh.png'), alt: 'Berita 1' },
    { src: getAssetPath('/bgsklh.png'), alt: 'Berita 2' },
    { src: getAssetPath('/bgsklh.png'), alt: 'Berita 3' },
    { src: '/bgsklh.png', alt: 'Berita 4' },
    { src: '/bgsklh.png', alt: 'Berita 1' },
    { src: '/bgsklh.png', alt: 'Berita 2' },
    { src: '/bgsklh.png', alt: 'Berita 3' },
    { src: '/bgsklh.png', alt: 'Berita 4' },
  ];

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavLanding />

        {/* Section Hero */}
        <section className="relative min-h-screen">
           <img
            src={getAssetPath('/bgsklh.png')}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-[3px] brightness-100 z-0"
          />
                <div className="absolute inset-0 bg-[#3171cd] opacity-55 mix-blend-multiply "></div>
          <div className="relative z-10 flex items-center justify-center text-center px-4 sm:px-10 md:px-20 py-32 sm:py-40 h-full">
            <div className="text-white max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
                Galeri Kegiatan
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl leading-tight">
                Lembaga Sertifikasi Profesi SMK Negeri 24 Jakarta
              </p>
            </div>
          </div>
        </section>

        {/* Album Kegiatan */}
        <main className="flex-grow bg-gray-50 py-10">
          <div className="py-16 px-4 bg-white">          
          <h2 className="text-start text-lg px-20">Galeri</h2>
          <h2 className="text-start text-4xl px-20 font-bold  mb-15">Foto LSP SMKN 24</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
            {galeriImages.map((item, index) => (
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
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white to-transparent flex items-end justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <img
                    src={getAssetPath('/twodev-teks.svg')}
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
    </>
  );
}

export default Galeri;
