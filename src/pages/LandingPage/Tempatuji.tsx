import FootLanding from "../../components/FootLanding";
import NavLanding from "../../components/NavLanding";

function Tempatuji() {
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
                Tempat Uji Kompetensi
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl leading-tight">
                Lembaga Sertifikasi Profesi SMK Negeri 24 Jakarta
              </p>
            </div>
          </div>
        </section>

        
        <main className="flex-grow bg-gray-50">
          
         
        </main>
        <FootLanding />
      </div>
    </>
  );
}

export default Tempatuji;
