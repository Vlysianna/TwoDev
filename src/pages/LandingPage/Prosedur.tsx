import FootLanding from "../../components/FootLanding";
import NavLanding from "../../components/NavLanding";
import { getAssetPath } from '@/utils/assetPath';

function Prosedur() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavLanding />

        {/* Section Hero dengan background */}
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
                Prosedur Pendaftaran Sertifikasi
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

export default Prosedur;
