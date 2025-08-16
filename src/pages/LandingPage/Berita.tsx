import FootLanding from "../../components/FootLanding";
import NavLanding from "../../components/NavLanding";

function Berita() {
  const berita = [
  {
    id: 1,
    judul: "Lembaga Sertifikasi Profesi SMK Negeri 24 Jakarta",
    penulis: "Jl.Bambu Hitam. Bambu Apus. Cipayung Rt.7 / Rw.3",
    tanggal: "23-08-24",
    deskripsi:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    gambar: "/bgsklh.png",
  },
  {
    id: 2,
    judul: "Lembaga Sertifikasi Profesi",
    penulis: "SMK Negeri 24 Jakarta",
    tanggal: "5 Feb",
    deskripsi:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    gambar: "/bgsklh.png",
  },
  {
    id: 3,
    judul: "Lembaga Sertifikasi Profesi",
    penulis: "SMK Negeri 24 Jakarta",
    tanggal: "3 Feb",
    deskripsi:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    gambar: "/berita-kecil.jpg",
  },
  // tambahkan berita lainnya
  {
    id: 3,
    judul: "Lembaga Sertifikasi Profesi",
    penulis: "SMK Negeri 24 Jakarta",
    tanggal: "3 Feb",
    deskripsi:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    gambar: "/berita-kecil.jpg",
  },
  {
    id: 3,
    judul: "Lembaga Sertifikasi Profesi",
    penulis: "SMK Negeri 24 Jakarta",
    tanggal: "3 Feb",
    deskripsi:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    gambar: "/berita-kecil.jpg",
  },
  {
    id: 3,
    judul: "Lembaga Sertifikasi Profesi",
    penulis: "SMK Negeri 24 Jakarta",
    tanggal: "3 Feb",
    deskripsi:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    gambar: "/berita-kecil.jpg",
  },
  {
    id: 3,
    judul: "Lembaga Sertifikasi Profesi",
    penulis: "SMK Negeri 24 Jakarta",
    tanggal: "3 Feb",
    deskripsi:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    gambar: "/berita-kecil.jpg",
  },
  {
    id: 3,
    judul: "Lembaga Sertifikasi Profesi",
    penulis: "SMK Negeri 24 Jakarta",
    tanggal: "3 Feb",
    deskripsi:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    gambar: "/berita-kecil.jpg",
  },
  {
    id: 3,
    judul: "Lembaga Sertifikasi Profesi",
    penulis: "SMK Negeri 24 Jakarta",
    tanggal: "3 Feb",
    deskripsi:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    gambar: "/berita-kecil.jpg",
  },
];

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavLanding />

        {/* Section Hero dengan background */}
        <section className="relative min-h-screen">
           <img
            src="/bgsklh.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-[3px] brightness-100 z-0"
          />
                <div className="absolute inset-0 bg-[#3171cd] opacity-55 mix-blend-multiply "></div>

          <div className="relative z-10 flex items-center justify-center text-center px-4 sm:px-10 md:px-20 py-32 sm:py-40 h-full">
            <div className="text-white max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
                Berita / Artikel
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl leading-tight">
                Lembaga Sertifikasi Profesi SMK Negeri 24 Jakarta
              </p>
            </div>
          </div>
        </section>

        
<main className="flex-grow bg-gray-50 py-10">
  <div className="container mx-auto px-4 md:px-8">
    <h2 className="text-xl md:text-2xl font-bold mb-6">Berita Terbaru LSP</h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* Kolom Kiri - Berita Utama */}
      {berita.length > 0 && (
        <div className="lg:col-span-2 rounded-lg w-2xl">
          <img
            src={berita[0].gambar}
            alt={berita[0].judul}
            className="w-full h-95 object-cover rounded-t-lg"
          />
          <div className="bg-[#E77D35] text-white text-center p-5 text-lg text-start">
    Lembaga Sertifikasi Profesi SMK Negeri 24 Jakarta
  </div>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{berita[0].judul}</h3>
            <p className="text-end text-sm text-gray-500 px-35">
{berita[0].tanggal}
            </p>
            <p className="text-sm text-gray-500 mb-2 ">
              {berita[0].penulis}
            </p>
            <p className="text-gray-700">{berita[0].deskripsi}</p>
          </div>
        </div>
      )}

      {/* Kolom Kanan - Scrollable List */}
      <div className=" rounded-lg  p-2 max-h-[600px] overflow-y-auto">
        {berita.slice(1).map((item) => (
          <div key={item.id} className="flex gap-4 mb-3 border-b pb-3 last:border-none last:pb-0">
            <img
              src={item.gambar}
              alt={item.judul}
              className="w-24 h-24 object-cover rounded"
            />
            <div>
              <h4 className="text-sm font-bold leading-tight">{item.judul}</h4>
              <p className="text-xs text-gray-500 mb-1">
                {item.penulis}, {item.tanggal}
              </p>
              <p className="text-xs text-gray-600">{item.deskripsi}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</main>


        <FootLanding />
      </div>
    </>
  );
}

export default Berita;
