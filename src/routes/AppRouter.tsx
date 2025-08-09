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
import KelolaAkunAsesi from "@/pages/Admin/AkunAsesi";
import KelolaMUK from "@/pages/Admin/KelolaSkema";
import EditAsesor from "@/pages/Admin/EditAsesor";
import KelolaAkunAsesor from "@/pages/Admin/AkunAsesor";
import VerifikasiPage from "@/pages/Admin/verifikasi";
import RegisterPage from "@/pages/Admin/register";
import EditAsesi from "@/pages/Admin/EditAsessi";
import KelolaOkupasi from "@/pages/Admin/okupasi/KelolaOkupasi";
import AplZeroTwo from "@/pages/asesi/Apl-02";
import DataSertifikasi from "@/pages/asesi/DataSertifikasi";
import DashboardAsesi from "@/pages/asesi/DashboardAsesi";
import AsessmentAktif from "@/pages/asesi/AsesmentAktif";
import AssassmentMandiri from "@/pages/asesi/AsassmentMandiri";
import AsassmentMandiriDetail from "@/pages/asesi/AssasmentMandiriDetail";
import PersetujuanAsesmenKerahasiaan from "@/pages/asesi/PersetujuanAsesmenKerahasiaan";
import AsessementPilihanGanda from "@/pages/asesi/AsessmentPilihanGanda";
import Test from "@/pages/LandingPage/Test";
import TambahSkema from "@/pages/Admin/TambahSkema";
import KelolaJurusan from "@/pages/Admin/kelolaJur";
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
      { path: paths.asesor, element: <Asesor /> },
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
          { path: paths.admin.kelolaAkunAsesor, element: <KelolaAkunAsesor /> },
          { path: paths.admin.editAsesi, element: <EditAsesi /> },
          { path: paths.admin.verifikasi, element: <VerifikasiPage /> },
          { path: paths.admin.tambahSkema, element: <TambahSkema /> },
          { path: paths.admin.kelolaJurusan, element: <KelolaJurusan /> },

          // Okupasi nested
          {
            path: paths.admin.okupasi.root,
            children: [
              { index: true, element: <KelolaOkupasi /> },
            ],
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
    ],
  },
]);

export default router;
