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
import DashboardAdmin from "@/pages/Admin/DashboardAdmin";
import AsessmentAktif from "@/pages/asesi/AsesmentAktif";
import AssassmentMandiri from "@/pages/asesi/AsassmentMandiri";
import AsassmentMandiriDetail from "@/pages/asesi/AssasmentMandiriDetail";
import PersetujuanAsesmenKerahasiaan from "@/pages/asesi/PersetujuanAsesmenKerahasiaan";
import AsessementPilihanGanda from "@/pages/asesi/AsessmentPilihanGanda";
import Test from "@/pages/LandingPage/Test";
import TambahSkema from "@/pages/Admin/TambahSkema";
import KelolaJurusan from "@/pages/Admin/kelolaJur";
import EditAsessi from "@/pages/Admin/EditAsessi";
import KelolaJadwal from "@/pages/Admin/KelolaJadwal";
import AplZeroOneAsesor from "@/pages/asesor/Apl-01-Assesor";
import DataSertifikasiAsesor from "@/pages/asesor/DataSertifikasiAsesor";
import DashboardAsesor from "@/pages/asesor/DashboardAsesor";
import TambahJadwal from "@/pages/Admin/TambahJadwal";
import paths from "./paths";
import TemplateAsesor from "@/pages/asesor/Template";
import Template2 from "@/pages/asesor/Template2";
import FIIADetail from "@/pages/asesor/FI.IA.01-Detail";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHome from "@/components/DashboardHome";
import AdminApl02 from "@/pages/Admin/Apl-02";

const RootLayout = () => <Outlet />;

const router = createBrowserRouter([
  {
    path: paths.root,
    element: <RootLayout />,
    children: [
      // Landing & Public Pages
      { index: true, element: <LandingPage /> },
      { path: paths.dashboard.about, element: <TentangLSP /> },
      { path: paths.dashboard.struktur, element: <StrukturLSP /> },
      { path: paths.dashboard.pengelolaSDM, element: <PengelolaSDM /> },
      { path: paths.dashboard.skema, element: <Skema /> },
      { path: paths.dashboard.tempatUji, element: <Tempatuji /> },
      { path: paths.dashboard.asesor, element: <Asesor /> },
      { path: paths.dashboard.prosedurPendaftaran, element: <Prosedur /> },
      { path: paths.dashboard.berita, element: <Berita /> },
      { path: paths.dashboard.galeri, element: <Galeri /> },
      { path: paths.dashboard.dokumen, element: <Dokumen /> },
      { path: paths.dashboard.test, element: <Test /> },

      // Dashboard route for authenticated users
      { path: "/dashboard", element: <ProtectedRoute><DashboardHome /></ProtectedRoute> },

      // Auth routes (public)
      {
        path: paths.auth.root,
        element: <ProtectedRoute requireAuth={false}><Outlet /></ProtectedRoute>,
        children: [
          { path: paths.auth.login, element: <LoginForm /> },
          { path: paths.auth.register, element: <RegisterPage /> },
          { path: paths.auth.registerAsesi, element: <RegisterForm /> },
        ],
      },

      // Admin routes (protected - role 1)
      {
        path: paths.admin.root,
        element: <ProtectedRoute allowedRoles={[1]}><Outlet /></ProtectedRoute>,
        children: [
          { index: true, element: <DashboardAdmin /> },
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
          { path: paths.admin.apl02, element: <AdminApl02 /> },

          // Okupasi nested
          {
            path: paths.admin.okupasi.root,
            children: [{ index: true, element: <KelolaOkupasi /> }],
          },
        ],
      },

      // Asesi routes (protected - role 3)
      {
        path: paths.asesi.root,
        element: <ProtectedRoute allowedRoles={[3]}><Outlet /></ProtectedRoute>,
        children: [
          { index: true, element: <DashboardAsesi /> },
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

      // Asesor routes (protected - role 2)
      {
        path: paths.asesor.root,
        element: <ProtectedRoute allowedRoles={[2]}><Outlet /></ProtectedRoute>,
        children: [
          { index: true, element: <DashboardAsesor /> },
          { path: paths.asesor.template, element: <TemplateAsesor /> },
          { path: paths.asesor.template2, element: <Template2 /> },
          { path: paths.asesor.fiiadetail, element: <FIIADetail /> },
          { path: paths.asesor.apl01, element: <AplZeroOneAsesor /> },
          { path: paths.asesor.dataSertifikasi, element: <DataSertifikasiAsesor /> },
        ],
      },
    ],
  },
]);

export default router;
