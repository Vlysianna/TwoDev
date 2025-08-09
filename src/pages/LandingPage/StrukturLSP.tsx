import FootLanding from "../../components/FootLanding";
import NavLanding from "../../components/NavLanding";

function StrukturLSP() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavLanding />

        {/* Section Hero dengan background */}
        <section className="relative min-h-screen">
          <img
            src="/bgsklh.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-sm brightness-75 z-0 "
          />

          <div className="relative z-10 flex items-center justify-center text-center px-4 sm:px-10 md:px-20 py-32 sm:py-40 h-full">
            <div className="text-white max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
                Struktur Organisasi
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl leading-tight">
                Lembaga Sertifikasi Profesi SMK Negeri 24 Jakarta
              </p>
            </div>
          </div>
        </section>

        {/* Section Konten Utama */}
        <main className="flex-grow bg-gray-50">
          {/* Struktur Organisasi */}
          <h2 className="text-xl sm:text-2xl font-semibold text-center mt-16 px-4">
            Struktur Organisasi
          </h2>
          <div className="flex items-center justify-center py-10 px-4 sm:px-6 md:px-10">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 sm:p-8 text-start">
              <div className="flex flex-col items-center py-10 px-4 sm:px-6 md:px-10">
                {/* Ketua LSP */}
                <div className="flex flex-col items-center">
                  <img
                    src="/ketua.jpg"
                    alt="Ketua LSP"
                    className="w-20 h-20 rounded-full object-cover mb-2 border"
                  />

                  <p className="font-semibold">Ketua LSP</p>
                </div>

                {/* Garis vertikal */}
                <div className="w-1 h-10 bg-gray-400"></div>

                {/* Dewan Pengarah & Komite Skema */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                  <div className="w-48 h-24 border rounded-lg flex flex-col items-center justify-center gap-2 p-2">
                    <img
                      src="/sertifikasi.jpg"
                      alt="Dewan pengarah"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <p className="text-sm font-semibold text-center">
                      Dewan pengarah
                    </p>
                  </div>
                  <div className="w-48 h-24 border rounded-lg flex flex-col items-center justify-center gap-2 p-2">
                    <img
                      src="/sertifikasi.jpg"
                      alt="Komite Skema"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <p className="text-sm font-semibold text-center">
                      Komite Skema
                    </p>
                  </div>
                </div>

                {/* Garis vertikal dari Ketua ke Manajer */}
                <div className="w-1 h-10 bg-gray-400 my-4"></div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                  <div className="w-48 h-24 border rounded-lg flex flex-col items-center justify-center gap-2 p-2">
                    <img
                      src="/admin.jpg"
                      alt="Manajer Administrasi"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <p className="text-sm font-semibold text-center">
                      Manajer Administrasi
                    </p>
                  </div>
                  <div className="w-48 h-24 border rounded-lg flex flex-col items-center justify-center gap-2 p-2">
                    <img
                      src="/mutu.jpg"
                      alt="Manajer Mutu"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <p className="text-sm font-semibold text-center">
                      Manajer Mutu
                    </p>
                  </div>
                  <div className="w-48 h-24 border rounded-lg flex flex-col items-center justify-center gap-2 p-2">
                    <img
                      src="/sertifikasi.jpg"
                      alt="Manajer Sertifikasi"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <p className="text-sm font-semibold text-center">
                      Manajer Sertifikasi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <FootLanding />
      </div>
    </>
  );
}

export default StrukturLSP;
