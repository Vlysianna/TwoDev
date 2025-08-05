import FootLanding from "../../components/FootLanding";
import NavLanding from "../../components/NavLanding";

function TentangLSP() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavLanding />
        <main className="min-h-screen">
          <img
            src="/bgsklh.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-sm brightness-75 z-0"
          />

          <div className="relative z-10 flex items-center justify-between px-20 py-40 h-full">
            <div className="text-white max-w-xl">
              <p className="text-2xl mb-4">
                Lembaga Sertifikasi Profesi SMKN 24 Jakarta
              </p>
              <h1 className="text-6xl font-extrabold leading-tight">
                Sertifikasikan <br />
                Profesimu!
              </h1>
            </div>

            <div className="w-[500px] h-[300px] bg-gray-300 rounded-lg shadow-lg"></div>
          </div>

          <div className="relative z-10 w-full bg-orange-500 text-white py-8 px-8 lg:px-20">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-xl lg:text-2xl font-bold mb-2">
                  Ayo Tingkatkan Kualitas Skill Anda Bersama Kami
                </h2>
                <p className="text-lg opacity-90">
                  Sebelum mendaftarkan sertifikasi pastikan anda memiliki akun
                  terlebih dahulu
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-center  mt-16">
            Tentang LSP SMK Negeri 24 Jakarta
          </h2>
          <div className="text-center flex items-center justify-center py-16 gap-8 px-10 ">
            <div className=" w-full bg-white rounded-xl shadow-lg p-8 text-start">
              <p className="text-black-700 mb-4">
                Lembaga Sertifikasi Profesi (LSP) SMKN 24 Jakarta adalah lembaga
                resmi yang berlisensi dari Badan Nasional Sertifikasi Profesi
                (BNSP) yang bertugas melaksanakan uji kompetensi bagi peserta
                didik, alumni, dan masyarakat umum. LSP ini dibentuk sebagai
                wujud komitmen SMKN 24 Jakarta dalam mencetak lulusan yang
                memiliki keterampilan, pengetahuan, dan sikap kerja sesuai
                standar nasional maupun internasional. Dengan adanya sertifikasi
                kompetensi, lulusan SMKN 24 Jakarta memiliki bukti pengakuan
                yang sah bahwa mereka siap bersaing di dunia kerja.
              </p>
              <p className="text-black-700 mb-4">
                LSP SMKN 24 Jakarta didukung oleh fasilitas uji yang memadai
                serta asesor kompetensi yang telah tersertifikasi BNSP. Proses
                sertifikasi dilaksanakan secara objektif, transparan, dan
                mengacu pada skema kompetensi yang sesuai dengan kebutuhan dunia
                usaha dan dunia industri (DUDI). Selain itu, LSP ini juga
                menjalin kerjasama dengan berbagai pihak untuk memastikan setiap
                kompetensi yang diujikan relevan dengan perkembangan teknologi
                dan tuntutan pasar kerja.
              </p>
              <p className="text-black-700 mb-6">
                Keberadaan LSP SMKN 24 Jakarta menjadi salah satu keunggulan
                sekolah dalam mempersiapkan tenaga kerja profesional dan
                kompeten. Dengan sertifikat kompetensi yang diakui secara
                nasional, peserta didik dan lulusan memiliki nilai tambah yang
                lebih tinggi di mata industri. Hal ini sejalan dengan visi LSP
                SMKN 24 Jakarta untuk menjadi lembaga sertifikasi profesi yang
                unggul, terpercaya, dan mampu menghasilkan SDM yang berdaya
                saing di era globalisasi.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-center mt-16">
            Visi, Misi & Moto
          </h2>
          <div className="text-center flex items-center justify-center py-16 gap-8 px-10">
            <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8 h-96">
              <h1 className="text-center font-bold mb-4">Visi</h1>
              <p className="text-black-700 mb-6 text-start">
                Menjadi LSP yang unggul, terpercaya, dan berdaya saing dalam
                mencetak sumber daya manusia yang kompeten, profesional, serta
                mampu memenuhi kebutuhan dunia kerja.
              </p>

              <h1 className="text-center font-bold mb-4">Moto</h1>
              <p className="text-black-700 text-start">
                1.Kompeten, Profesional, Siap Bersaing <br />
                2.Mewujudkan SDM Unggul dengan Sertifikasi Kompetensi <br />
                3.Standar Nasional, Kualitas Global <br />
                4.Mencetak Tenaga Kerja Tersertifikasi dan Berdaya Saing <br />
                5.Kompetensi Teruji, Masa Depan Pasti
              </p>
            </div>

            <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8 h-96">
              <h1 className="text-center font-bold mb-4">Misi</h1>
              <p className="text-black-700 text-start">
                1. Menyelenggarakan sertifikasi kompetensi secara profesional,
                objektif, dan sesuai standar BNSP. <br />
                2. Membina dan meningkatkan
                kapasitas asesor kompetensi agar mampu memberikan penilaian yang
                berkualitas. <br />
                3. Memperkuat kerjasama dengan dunia usaha, dunia
                industri, serta instansi terkait dalam mendukung terserapnya
                tenaga kerja kompeten. <br />
                4. Memberikan layanan sertifikasi yang
                terjangkau, transparan, dan bermanfaat bagi peserta didik,
                alumni, maupun masyarakat umum. <br />
                5. Mendorong lulusan memiliki
                sertifikat kompetensi sebagai bekal memasuki dunia kerja.
              </p>
            </div>
          </div>
        </main>
        <FootLanding />
      </div>
    </>
  );
}
export default TentangLSP;
