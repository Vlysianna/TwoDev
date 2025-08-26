import { createBrowserRouter, Outlet } from "react-router";
import LoginForm from "@/pages/login/Login";
import RegisterForm from "@/pages/register/Register";
import AplZeroOne from "@/pages/asesi/Apl-01";
import LandingPage from "@/pages/LandingPage/LandingPage";
import TentangLSP from "@/pages/LandingPage/TentangLSP";
import Skema from "@/pages/LandingPage/Skema";
import StrukturLSP from "@/pages/LandingPage/StrukturLSP";
import Tempatuji from "@/pages/LandingPage/Tempatuji";
import Asesor from "@/pages/LandingPage/Asesor";
import Prosedur from "@/pages/LandingPage/Prosedur";
import Berita from "@/pages/LandingPage/Berita";
import Galeri from "@/pages/LandingPage/Galeri";
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
import DashboardAdmin from "@/pages/admin/DashboardAdmin";
import AsessmentAktif from "@/pages/asesi/AsesmentAktif";
import AssassmentMandiri from "@/pages/asesi/AsassmentMandiri";
import AsassmentMandiriDetail from "@/pages/asesi/AssasmentMandiriDetail";
import PersetujuanAsesmenKerahasiaan from "@/pages/asesi/PersetujuanAsesmenKerahasiaan";
import AsessementPilihanGanda from "@/pages/asesi/AsessmentPilihanGanda";
import Test from "@/pages/LandingPage/Test";
import TambahSkema from "@/pages/admin/TambahMUK";
import KelolaJurusan from "@/pages/admin/kelolaJur";
import EditAsessi from "@/pages/admin/EditAsessi";
import KelolaJadwal from "@/pages/admin/KelolaJadwal";
import AplZeroOneAsesor from "@/pages/asesor/Apl-01-Assesor";
import DataSertifikasiAsesor from "@/pages/asesor/DataSertifikasiAsesor";
import DashboardAsesor from "@/pages/asesor/dashboard";
import TambahJadwal from "@/pages/admin/TambahJadwal";
import paths from "./paths";
import TemplateAsesor from "@/pages/asesor/Template";
import Template2 from "@/pages/asesor/Template2";
import FIIADetail from "@/pages/asesor/FI.IA.01-Detail";
import FIIA01Page from "@/pages/asesor/FI-IA-01";
import HasilAsesmen from "@/pages/asesor/Hasil";
import Dashboard from "@/pages/asesor/dashboard";
import AssessmentRecord from "@/pages/asesor/AssessmentRecord";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHome from "@/components/DashboardHome";
import AdminApl02 from "@/pages/admin/Apl-02";
import AssessmentReport from "@/pages/asesor/AssesmentReport";
import Hasil from "@/pages/asesor/Hasil";
import Contact from "@/pages/LandingPage/Contact";
import UmpanBalik from "@/pages/asesi/UmpanBalik";
import BandingAsesmen from "@/pages/asesi/BandingAsesmen";
import FRIA02 from "@/pages/asesi/FR-IA-02";
import FRAK05 from "@/pages/asesor/FRAK05";
import AsesmenMandiri from "@/pages/asesor/AsesmenMandiri";
import PersetujuanKerahasiaan from "@/pages/asesor/PersetujuanKerahasiaan";
import LembarJawaban from "@/pages/asesor/LembarJawaban";
import CekAsesmenMandiri from "@/pages/asesor/CekAsesmenMandiri";
import CekAssessmentMandiriDetail from "@/pages/asesor/CekAsesmenMandiriDetail";
import PersetujuanAsesmenKerahasiaanAsesor from "@/pages/asesor/PersetujuanAsesmenKerahasiaanAsesor";
import FaktaIntegritas from "@/pages/asesor/FaktaIntegritas";
import FRIA03 from "@/pages/asesor/FR-IA-03";
import IsApproveApl01 from "@/components/IsApproveApl01";
import BiodataAsesor from "@/pages/asesor/BiodataAsesor";

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
			{ path: paths.dashboard.skema, element: <Skema /> },
			{ path: paths.dashboard.tempatUji, element: <Tempatuji /> },
			{ path: paths.dashboard.asesor, element: <Asesor /> },
			{ path: paths.dashboard.prosedurPendaftaran, element: <Prosedur /> },
			{ path: paths.dashboard.berita, element: <Berita /> },
			{ path: paths.dashboard.galeri, element: <Galeri /> },
			{ path: paths.dashboard.contact, element: <Contact /> },
			{ path: paths.dashboard.test, element: <Test /> },

			// Dashboard route for authenticated users
			{
				path: "/dashboard",
				element: (
					<ProtectedRoute>
						<DashboardHome />
					</ProtectedRoute>
				),
			},

			// Auth routes (public)
			{
				path: paths.auth.root,
				element: (
					<ProtectedRoute requireAuth={false}>
						<Outlet />
					</ProtectedRoute>
				),
				children: [
					{ path: paths.auth.login, element: <LoginForm /> },
					{ path: paths.auth.register, element: <RegisterPage /> },
					{ path: paths.auth.registerAsesi, element: <RegisterForm /> },
				],
			},

			// Admin routes (protected - role 1)
			{
				path: paths.admin.root,
				element: (
					<ProtectedRoute allowedRoles={[1]}>
						<Outlet />
					</ProtectedRoute>
				),
				children: [
					{ index: true, element: <DashboardAdmin /> },
					{ path: paths.admin.kelolaAkunAsesi, element: <KelolaAkunAsesi /> },
					{ path: paths.admin.kelolaMUK, element: <KelolaMUK /> },
					{ path: paths.admin.editAsesor, element: <EditAsesor /> },
					{ path: paths.admin.createAsesor, element: <EditAsesor /> },
					{ path: paths.admin.editAsesorPattern, element: <EditAsesor /> },
					{ path: paths.admin.editAsessi, element: <EditAsessi /> },
					{ path: "/admin/edit-asesi/:id", element: <EditAsesi /> },
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
				element: (
					<ProtectedRoute allowedRoles={[3]}>
						<Outlet />
					</ProtectedRoute>
				),
				children: [
					{ index: true, element: <DashboardAsesi /> },
					{ path: paths.asesi.dashboard, element: <DashboardAsesi /> },
					{
						path: paths.asesi.assessment.root,
						element: (
							<ProtectedRoute allowedRoles={[3]}>
								<IsApproveApl01>
									<Outlet />
								</IsApproveApl01>
							</ProtectedRoute>
						),
						children: [
							{
								path: paths.asesi.assessment.apl01Pattern,
								element: <AplZeroOne />,
							},
							{ path: paths.asesi.assessment.apl02, element: <AplZeroTwo /> },
							{
								path: paths.asesi.assessment.dataSertifikasiPattern,
								element: <DataSertifikasi />,
							},
							{
								path: paths.asesi.assessment.asesmenMandiriPattern,
								element: <AssassmentMandiri />,
							},
							{
								path: paths.asesi.assessment.asesmenMandiriDetailPattern,
								element: <AsassmentMandiriDetail />,
							},
						],
					},
					{ path: paths.asesi.asesmenDiikuti, element: <AsessmentAktif /> },
					{ path: paths.asesi.umpanBalik, element: <UmpanBalik /> },
					{ path: paths.asesi.bandingAsesmen, element: <BandingAsesmen /> },
					{
						path: paths.asesi.persetujuanAsesmenKerahasiaan,
						element: <PersetujuanAsesmenKerahasiaan />,
					},
					{ path: paths.asesi.fria02, element: <FRIA02 /> },
					{
						path: paths.asesi.asesmenPilihanGanda,
						element: <AsessementPilihanGanda />,
					},
				],
			},

			// Asesor routes (protected - role 2)
			{
				path: paths.asesor.root,
				element: (
					<ProtectedRoute allowedRoles={[2]}>
						<Outlet />
					</ProtectedRoute>
				),
				children: [
					{ index: true, element: <DashboardAsesor /> },
					{ path: paths.asesor.template, element: <TemplateAsesor /> },
					{ path: paths.asesor.template2, element: <Template2 /> },
					{ path: paths.asesor.dashboardAsesor, element: <DashboardAsesor /> },
					{ path: paths.asesor.biodata, element: <BiodataAsesor /> },
					{
						path: paths.asesor.cekAsesmenMandiri,
						element: <CekAsesmenMandiri />,
					},
					{
						path: paths.asesor.cekAsesmenMandiriDetail,
						element: <CekAssessmentMandiriDetail />,
					},
					{
						path: paths.asesor.persetujuanAsesmenKerahasiaanAsesor,
						element: <PersetujuanAsesmenKerahasiaanAsesor />,
					},
					{ path: paths.asesor.faktaIntegritas, element: <FaktaIntegritas /> },
					{ path: paths.asesor.fria03, element: <FRIA03 /> },
					{ path: paths.asesor.fiia, element: <FIIA01Page /> },
					{ path: paths.asesor.fiiadetail, element: <FIIADetail /> },
					{ path: paths.asesor.frak02, element: <AssessmentRecord /> },
					{ path: paths.asesor.apl01, element: <AplZeroOneAsesor /> },
					{
						path: paths.asesor.dataSertifikasi,
						element: <DataSertifikasiAsesor />,
					},
					{ path: paths.asesor.hasilAsesmen, element: <HasilAsesmen /> },
					{ path: paths.asesor.dashboard, element: <Dashboard /> },
					{ path: paths.asesor.hasil, element: <Hasil /> },
					{ path: paths.asesor.frak05, element: <FRAK05 /> },
					{ path: paths.asesor.asesmenMandiri, element: <AsesmenMandiri /> },
					{
						path: paths.asesor.persetujuanKerahasiaan,
						element: <PersetujuanKerahasiaan />,
					},
					{ path: paths.asesor.lembarJawaban, element: <LembarJawaban /> },
					{
						path: paths.asesor.assessmentRecord,
						element: <AssessmentRecord />,
					},
					{ path: paths.asesor.assesmentReport, element: <AssessmentReport /> },
				],
			},
		],
	},
]);

export default router;
