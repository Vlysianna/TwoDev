import FootLanding from "../../components/FootLanding";
import NavLanding from "../../components/NavLanding";
import { FileText } from "lucide-react"; // untuk icon file

// Data dokumen dibuat di const agar mudah diubah
const documents = [
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
  { title: "Lembaga Sertifikasi", subtitle: "Profesi SMKN 24" },
];

function Dokumen() {
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
                File Dokumen
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl leading-tight">
                Lembaga Sertifikasi Profesi SMK Negeri 24 Jakarta
              </p>
            </div>
          </div>
        </section>

        <main className="flex-grow bg-gray-50 py-10 px-4 sm:px-10">
          <h2 className="text-center text-lg font-bold mb-15">File Dokumen</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center justify-between aspect-square"
              >
                <FileText className="text-blue-500 w-8 h-8 self-end" />
                <div className="mt-auto text-center">
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-sm text-gray-500">{doc.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        <FootLanding />
      </div>
    </>
  );
}

export default Dokumen;
