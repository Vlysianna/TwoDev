import { createBrowserRouter, Outlet } from "react-router";
import LoginForm from "@/pages/login/Login";
import RegisterForm from "@/pages/register/Register";
import AplZeroOne from "@/pages/asesi/Apl-01";
import LandingPage from "@/pages/LandingPage/LandingPage";
import TentangLSP from "@/pages/LandingPage/TentangLSP";
import Skema from "@/pages/LandingPage/Skema";
import StrukturLSP from "@/pages/LandingPage/StrukturLSP";
import PengelolaSDM from "@/pages/LandingPage/PengelolaSDM";
import Tempatuji from "@/pages/LandingPage/Tempatuji";
import Asesor from "@/pages/LandingPage/Asesor";
import Prosedur from "@/pages/LandingPage/Prosedur";
import Berita from "@/pages/LandingPage/Berita";
import Galeri from "@/pages/LandingPage/Galeri";
import Dokumen from "@/pages/LandingPage/Dokumen";
import KelolaAkunAsesi from "@/pages/admin/AkunAsesi";
import KelolaMUK from "@/pages/admin/KelolaSkema";
import EditAsesor from "@/pages/admin/EditAsesor";
import KelolaAkunAsesor from "@/pages/admin/AkunAsesor";
import VerifikasiPage from "@/pages/admin/verifikasi";
import RegisterPage from "@/pages/admin/register";
import EditAsesi from "@/pages/admin/EditAsessi";
import KelolaOkupasi from "@/pages/admin/okupasi/KelolaOkupasi";
import AplZeroTwo from "@/pages/asesi/Apl-02";
import DataSertifikasi from "@/pages/asesi/DataSertifikasi";
import DashboardAsesi from "@/pages/asesi/DashboardAsesi";
import AsessmentAktif from "@/pages/asesi/AsesmentAktif";
import AssassmentMandiri from "@/pages/asesi/AsassmentMandiri";
import AsassmentMandiriDetail from "@/pages/asesi/AssasmentMandiriDetail";
import PersetujuanAsesmenKerahasiaan from "@/pages/asesi/PersetujuanAsesmenKerahasiaan";
import AsessementPilihanGanda from "@/pages/asesi/AsessmentPilihanGanda";
import Test from "@/pages/LandingPage/Test";
import TambahSkema from "@/pages/admin/TambahSkema";
import KelolaJurusan from "@/pages/admin/kelolaJur";
import EditAsessi from "@/pages/admin/EditAsessi";
import KelolaJadwal from "@/pages/admin/KelolaJadwal";
import TambahJadwal from "@/pages/admin/TambahJadwal";
import TemplateAsesor from "@/pages/asesor/Template";
import Template2 from "@/pages/asesor/Template2";
import FIIADetail from "@/pages/asesor/FI.IA.01-Detail";
import paths from "./paths";

const RootLayout = () => <Outlet />;

const router = createBrowserRouter([
  {
    path: paths.root,
    element: <RootLayout />,
    children: [
      // Landing & Public Pages
      { index: true, element: <LandingPage /> },
      { path: paths.about, element: <TentangLSP /> },
      { path: paths.struktur, element: <StrukturLSP /> },
      { path: paths.pengelolaSDM, element: <PengelolaSDM /> },
      { path: paths.skema, element: <Skema /> },
      { path: paths.tempatUji, element: <Tempatuji /> },
      { path: paths.asesor.root, element: <Asesor /> },
      { path: paths.prosedurPendaftaran, element: <Prosedur /> },
      { path: paths.berita, element: <Berita /> },
      { path: paths.galeri, element: <Galeri /> },
      { path: paths.dokumen, element: <Dokumen /> },
      { path: paths.test, element: <Test /> },

      // Auth routes
      {
        path: paths.auth.root,
        children: [
          { path: paths.auth.login, element: <LoginForm /> },
          { path: paths.auth.register, element: <RegisterPage /> },
          { path: paths.auth.registerAsesi, element: <RegisterForm /> },
        ],
      },

      // Admin routes
      {
        path: paths.admin.root,
        children: [
          { path: paths.admin.kelolaAkunAsesi, element: <KelolaAkunAsesi /> },
          { path: paths.admin.kelolaMUK, element: <KelolaMUK /> },
          { path: paths.admin.editAsesor, element: <EditAsesor /> },
          { path: paths.admin.editAsessi, element: <EditAsessi /> },
          { path: paths.admin.kelolaAkunAsesor, element: <KelolaAkunAsesor /> },
          { path: paths.admin.editAsesi, element: <EditAsesi /> },
          { path: paths.admin.verifikasi, element: <VerifikasiPage /> },
          { path: paths.admin.tambahSkema, element: <TambahSkema /> },
          { path: paths.admin.kelolaJurusan, element: <KelolaJurusan /> },
          { path: paths.admin.kelolaJadwal, element: <KelolaJadwal /> },
          { path: paths.admin.tambahJadwal, element: <TambahJadwal /> },

          // Okupasi nested
          {
            path: paths.admin.okupasi.root,
            children: [{ index: true, element: <KelolaOkupasi /> }],
          },
        ],
      },

      // Asesi routes
      {
        path: paths.asesi.root,
        children: [
          { path: paths.asesi.dashboard, element: <DashboardAsesi /> },
          { path: paths.asesi.apl01, element: <AplZeroOne /> },
          { path: paths.asesi.apl02, element: <AplZeroTwo /> },
          { path: paths.asesi.dataSertifikasi, element: <DataSertifikasi /> },
          { path: paths.asesi.asesmenAktif, element: <AsessmentAktif /> },
          { path: paths.asesi.asesmenMandiri, element: <AssassmentMandiri /> },
          { path: paths.asesi.asesmenMandiriDetail, element: <AsassmentMandiriDetail /> },
          {
            path: paths.asesi.persetujuanAsesmenKerahasiaan,
            element: <PersetujuanAsesmenKerahasiaan />,
          },
          { path: paths.asesi.asesmenPilihanGanda, element: <AsessementPilihanGanda /> },
        ],
      },

      // Asesor routes
      {
        path: paths.asesor.root,
        children: [
          { path: paths.asesor.template, element: <TemplateAsesor /> },
          { path: paths.asesor.template2, element: <Template2 /> },
          { path: paths.asesor.fiiadetail, element: <FIIADetail /> },
        ],
      },
    ],
  },
]);

export default router;
