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
import DataSertifikasi from "@/pages/asesi/DataSertifikasi";
import DashboardAsesi from "@/pages/asesi/DashboardAsesi";
import DashboardAdmin from "@/pages/admin/DashboardAdmin";
import AsessmentAktif from "@/pages/asesi/AsesmentAktif";
import Test from "@/pages/LandingPage/Test";
import TambahSkema from "@/pages/admin/TambahMUK";
import KelolaJurusan from "@/pages/admin/kelolaJur";
import EditAsessi from "@/pages/admin/EditAsessi";
import KelolaJadwal from "@/pages/admin/KelolaJadwal";
import TambahJadwal from "@/pages/admin/TambahJadwal";
import paths from "./paths";
import Ia01Detail from "@/pages/asesor/Ia-01-Detail";
import Ia01 from "@/pages/asesor/Ia-01";
import HasilAsesmen from "@/pages/asesor/HasilAsesmen";
import Ak02 from "@/pages/asesor/Ak-02";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHome from "@/components/DashboardHome";
import AdminApl02 from "@/pages/admin/Apl-02";
import Contact from "@/pages/LandingPage/Contact";
import Ak05 from "@/pages/asesor/Ak-05";
import LembarJawaban from "@/pages/asesor/LembarJawaban";
import CekApl02 from "@/pages/asesor/Apl-02";
import CekAk01 from "@/pages/asesor/Ak-01";
import FaktaIntegritas from "@/pages/asesor/FaktaIntegritas";
import Ia03 from "@/pages/asesor/Ia-03";
import IsApproveApl01 from "@/components/IsApproveApl01";
import BiodataAsesor from "@/pages/asesor/BiodataAsesor";
import Apl02 from "@/pages/asesi/Apl-02";
import Apl02Detail from "@/pages/asesi/Apl-02-Detail";
import Ak04 from "@/pages/asesi/Ak-04";
import Ia05 from "@/pages/asesi/Ia-05";
import Ia02 from "@/pages/asesi/Ia-02";
import Ak01 from "@/pages/asesi/Ak-01";
import Ak03 from "@/pages/asesi/Ak-03";
import CekApl02Detail from "@/pages/asesor/Apl-02-Detail";
import DashboardAsesor from "@/pages/asesor/DashboardAsesor";
import DashboardPenilaian from "@/pages/asesor/DashboardPenilaian";
import DashboardAsesmenMandiri from "@/pages/asesor/DashboardAsesmenMandiri";
import DataAsesor from "@/pages/public/DataAsesor";
import DataAssesi from "@/pages/public/DataAssesi";

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
								element: <Ia02 /> 
							},
							{
								path: paths.asesi.assessment.ia05Pattern,
								element: <Ia05 />,
							},
							{
								path: paths.asesi.assessment.ak01Pattern,
								element: <Ak01 />,
							}
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
					{ index: true, element: <DashboardAsesor /> },
					{ path: paths.asesor.dashboardAsesor, element: <DashboardAsesor /> },
					{ path: paths.asesor.dashboardAsesmenMandiri, element: <DashboardAsesmenMandiri /> },
					{ path: paths.asesor.dashboardPenilaian, element: <DashboardPenilaian /> },
					{ path: paths.asesor.biodata, element: <BiodataAsesor /> },
					{ path: paths.asesor.faktaIntegritas, element: <FaktaIntegritas /> },
					{
						path: paths.asesor.cekApl02,
						element: <CekApl02 />,
					},
					{
						path: paths.asesor.cekApl02Detail,
						element: <CekApl02Detail />,
					},
					{ path: paths.asesor.ia01, element: <Ia01 /> },
					{ path: paths.asesor.ia01Detail, element: <Ia01Detail /> },
					{ path: paths.asesor.ia03, element: <Ia03 /> },
					{
						path: paths.asesor.cekAk01,
						element: <CekAk01 />,
					},
					{ path: paths.asesor.ak02, element: <Ak02 /> },
					{ path: paths.asesor.ak05, element: <Ak05 /> },
					{ path: paths.asesor.hasilAsesmen, element: <HasilAsesmen /> },
					{ path: paths.asesor.lembarJawaban, element: <LembarJawaban /> },
					{ path: paths.asesor.dataAsesor, element: <DataAsesor /> },
				],
			},
		],
	},
]);

export default router;
