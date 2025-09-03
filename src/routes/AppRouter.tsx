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
import KelolaMUK from "@/pages/admin/KelolaMuk";
import EditAsesor from "@/pages/admin/EditAsesor";
import KelolaAkunAsesor from "@/pages/admin/AkunAsesor";
import VerifikasiPage from "@/pages/admin/verifikasi";
import RegisterPage from "@/pages/admin/register";
import EditAsesi from "@/pages/admin/EditAsessi";
import KelolaOkupasi from "@/pages/admin/okupasi/KelolaOkupasi";
import DataSertifikasi from "@/pages/asesi/DataSertifikasi";
import DashboardAsesi from "@/pages/asesi/DashboardAsesi";
import DashboardAdmin from "@/pages/admin/DashboardAdmin";
import AsessmentAktif from "@/pages/asesi/AsesmentAktif";
import Test from "@/pages/LandingPage/Test";
import TambahMUK from "@/pages/admin/TambahMUK";
import KelolaJurusan from "@/pages/admin/kelolaJur";
import EditAsessi from "@/pages/admin/EditAsessi";
import KelolaJadwal from "@/pages/admin/KelolaJadwal";
import TambahJadwal from "@/pages/admin/TambahJadwal";
import paths from "./paths";
import Ia01Detail from "@/pages/Asesor/Ia-01-Detail";
import Ia01 from "@/pages/Asesor/Ia-01";
import Ak02 from "@/pages/Asesor/Ak-02";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHome from "@/components/DashboardHome";
import AdminApl02 from "@/pages/admin/Apl-02";
import Contact from "@/pages/LandingPage/Contact";
import Ak05 from "@/pages/Asesor/Ak-05";
import LembarJawaban from "@/pages/Asesor/LembarJawaban";
import CekApl02 from "@/pages/Asesor/Apl-02";
import CekAk01 from "@/pages/Asesor/Ak-01";
import FaktaIntegritas from "@/pages/Asesor/FaktaIntegritas";
import Ia03 from "@/pages/Asesor/Ia-03";
import AssessmentAsesiProvider from "@/components/AssessmentAsesiProvider";
import BiodataAsesor from "@/pages/Asesor/BiodataAsesor";
import Apl02 from "@/pages/asesi/Apl-02";
import Apl02Detail from "@/pages/asesi/Apl-02-Detail";
import Ak04 from "@/pages/asesi/Ak-04";
import Ia05 from "@/pages/asesi/Ia-05";
import Ia02 from "@/pages/asesi/Ia-02";
import Ak01 from "@/pages/asesi/Ak-01";
import Ak03 from "@/pages/asesi/Ak-03";
import CekApl02Detail from "@/pages/Asesor/Apl-02-Detail";
import DashboardAsesor from "@/pages/Asesor/DashboardAsesor";
import DashboardPenilaian from "@/pages/Asesor/DashboardPenilaian";
import DataAsesor from "@/pages/public/DataAsesor";
import DataAssesi from "@/pages/public/DataAssesi";
import AssessmentAsesorProvider from "@/components/AssessmentAsesorProvider";
import Ia05CAssessee from "@/pages/asesi/Ia-05-C";
import Ia05C from "@/pages/Asesor/Ia-05-C";
import DashboardAsesmenMandiri from "@/pages/Asesor/DashboardAsesmenMandiri";
import Ia02Assessor from "@/pages/Asesor/Ia-02";


const router = createBrowserRouter([
	{
		path: paths.root,
		element: <Outlet />,
		children: [
			// Landing & Public Pages
			{ index: true, element: <LandingPage /> },
			// legacy path for older links to APL-02 (accepts id param)
			{ path: "/apl-02/:id", element: <Apl02 /> },
			// legacy/alternate path for assesmen aktif (avoid 404 on older links)
			{ path: "/asesmen-aktif-asesi", element: <AsessmentAktif /> },
			// assessor legacy path (some links point here instead of the new /asesor/... path)
			{ path: "/asesmen-aktif-asesor", element: <DashboardAsesor /> },
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

			// Public route
			{ path: paths.public.dataAsesor, element: <DataAsesor /> },
			{ path: paths.public.dataAsesi, element: <DataAssesi /> },

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
					{ path: paths.admin.tambahMuk, element: <TambahMUK /> },
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
							<AssessmentAsesiProvider>
								<Outlet />
							</AssessmentAsesiProvider>
						),
						children: [
							{
								path: paths.asesi.assessment.apl01Pattern,
								element: <AplZeroOne />,
							},
							{
								path: paths.asesi.assessment.dataSertifikasiPattern,
								element: <DataSertifikasi />,
							},
							{
								path: paths.asesi.assessment.apl02Pattern,
								element: <Apl02 />,
							},
							{
								path: paths.asesi.assessment.apl02DetailPattern,
								element: <Apl02Detail />,
							},
							{
								path: paths.asesi.assessment.ia02Pattern,
								element: <Ia02 />,
							},
							{
								path: paths.asesi.assessment.ia05Pattern,
								element: <Ia05 />,
							},
							{
								path: paths.asesi.assessment.ia05CAssesseePattern,
								element: <Ia05CAssessee />,
							},
							{
								path: paths.asesi.assessment.ak01Pattern,
								element: <Ak01 />,
							},
						],
					},
					{ path: paths.asesi.asesmenDiikuti, element: <AsessmentAktif /> },
					{ path: paths.asesi.ak03, element: <Ak03 /> },
					{ path: paths.asesi.ak04, element: <Ak04 /> },
					{ path: paths.asesi.dataAsesi, element: <DataAssesi /> },
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
					{
						path: paths.asesor.assessment.root,
						element: (
							<AssessmentAsesorProvider>
								<Outlet />
							</AssessmentAsesorProvider>
						),
						children: [
							{
								path: paths.asesor.assessment.dashboardAsesmenMandiriPattern,
								element: <DashboardAsesmenMandiri />,
							},
							{
								path: paths.asesor.assessment.faktaIntegritasPattern,
								element: <FaktaIntegritas />,
							},
							{
								path: paths.asesor.assessment.cekApl02Pattern,
								element: <CekApl02 />,
							},
							{
								path: paths.asesor.assessment.cekApl02DetailPattern,
								element: <CekApl02Detail />,
							},
							{ path: paths.asesor.assessment.ia01Pattern, element: <Ia01 /> },
							{
								path: paths.asesor.assessment.ia01DetailPattern,
								element: <Ia01Detail />,
							},
							{ path: paths.asesor.assessment.ia02Pattern, element: <Ia02Assessor /> },
							{ path: paths.asesor.assessment.ia03Pattern, element: <Ia03 /> },
							{
								path: paths.asesor.assessment.ak01Pattern,
								element: <CekAk01 />,
							},
							{ path: paths.asesor.assessment.ak02Pattern, element: <Ak02 /> },
							{ path: paths.asesor.assessment.ak05Pattern, element: <Ak05 /> },
							{
								path: paths.asesor.assessment.ia05cPattern,
								element: <Ia05C />,
							},
							{
								path: paths.asesor.assessment.lembarJawabanPattern,
								element: <LembarJawaban />,
							},
						],
					},
					{ index: true, element: <DashboardAsesor /> },
					{ path: paths.asesor.dashboardAsesor, element: <DashboardAsesor /> },

					{
						path: paths.asesor.dashboardPenilaian,
						element: <DashboardPenilaian />,
					},
					{ path: paths.asesor.biodata, element: <BiodataAsesor /> },

					{ path: paths.asesor.dataAsesor, element: <DataAsesor /> },
				],
			},
		],
	},
]);

export default router;
