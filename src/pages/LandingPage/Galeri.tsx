import FootLanding from "../../components/FootLanding";
import NavLanding from "../../components/NavLanding";
import { Image as ImageIcon } from "lucide-react"; // ikon placeholder

function Galeri() {
  // Data gambar bisa diganti di sini
  const galeriData = [
    "/img1.jpg",
    "/img2.jpg",
    "/img3.jpg",
    "/img4.jpg",
    "/img5.jpg",
    "/img6.jpg",
  ];

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavLanding />

        {/* Section Hero */}
        <section className="relative min-h-screen">
          <img
            src="/bgsklh.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-sm brightness-75 z-0"
          />
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
          <h2 className="text-center text-lg font-bold mb-15">Album Kegiatan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-35 max-w-5xl mx-auto px-4">
            {galeriData.map((src, index) => (
              <div
                key={index}
                className="aspect-4/3 bg-gray-300 flex items-center justify-center rounded-lg overflow-hidden"
              >
                {src ? (
                  <img
                    src={src}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-500" />
                )}
              </div>
            ))}
          </div>
        </main>

        <FootLanding />
      </div>
    </>
  );
}

export default Galeri;
