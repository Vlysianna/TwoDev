import { createBrowserRouter, Outlet, Navigate } from "react-router";
import LoginForm from "@/pages/login/Login";
import RegisterForm from "@/pages/register/Register";
import AplZeroOne from "@/pages/asesi/Apl-01";
import KelolaAkunAsesi from "@/pages/admin/AkunAsesi";
import KelolaMUK from "@/pages/admin/KelolaMuk";
import EditAsesor from "@/pages/admin/EditAsesor";
import KelolaAkunAsesor from "@/pages/admin/AkunAsesor";
import KelolaUser from "@/pages/admin/KelolaUser";
import VerifikasiPage from "@/pages/admin/verifikasi";
import EditAsesi from "@/pages/admin/EditAsessi";
import KelolaOkupasi from "@/pages/admin/okupasi/KelolaOkupasi";
import DataSertifikasi from "@/pages/asesi/DataSertifikasi";
import DashboardAsesi from "@/pages/asesi/DashboardAsesi";
import DashboardAdmin from "@/pages/admin/DashboardAdmin";
import BioDataAdmin from "@/pages/admin/BioDataAdmin";
import BiodataAdminProtectedRoute from "@/components/BiodataAdminProtectedRoute";
import AsessmentAktif from "@/pages/asesi/AsesmentAktif";
// Test page removed
import TambahMUK from "@/pages/admin/TambahMUK";
import EditAsessi from "@/pages/admin/EditAsessi";
import KelolaJadwal from "@/pages/admin/KelolaJadwal";
import TambahJadwal from "@/pages/admin/TambahJadwal";
import paths from "./paths";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHome from "@/components/DashboardHome";
// Contact page removed
import AssessmentAsesiProvider from "@/components/AssessmentAsesiProvider";
import Apl02Detail from "@/pages/asesi/Apl-02-Detail";
import Ak04Asesi from "@/pages/asesi/Ak-04";
import Ia05Asesi from "@/pages/asesi/Ia-05";
import Apl02Asesi from "@/pages/asesi/Apl-02";
import Ia03Asesi from "@/pages/asesi/Ia-03";
import Ia02Asesi from "@/pages/asesi/Ia-02";
import Ak02Asesi from "@/pages/asesi/Ak-02";
import Ak01Asesi from "@/pages/asesi/Ak-01";
import Ak03Asesi from "@/pages/asesi/Ak-03";
import Ak05Asesi from "@/pages/asesi/Ak-05";
import DataAsesor from "@/pages/public/DataAsesor";
import DataAssesi from "@/pages/public/DataAssesi";
import AssessmentAsesorProvider from "@/components/AssessmentAsesorProvider";
import FaktaIntegritas from "@/pages/asesor/FaktaIntegritas";
import KelolaJurusan from "@/pages/admin/kelolaJur";
import Ia05CAssessee from "@/pages/asesi/Ia-05-C";
import DashboardAsesor from "@/pages/asesor/DashboardAsesor";
import DashboardAsesmenMandiri from "@/pages/asesor/DashboardAsesmenMandiri";
import Apl02Asesor from "@/pages/asesor/Apl-02";
import Apl02DetailAsesor from "@/pages/asesor/Apl-02-Detail";
import Ia01Asesor from "@/pages/asesor/Ia-01";
import Ia01DetailAsesor from "@/pages/asesor/Ia-01-Detail";
import Ia02Asesor from "@/pages/asesor/Ia-02";
import Ia03Asesor from "@/pages/asesor/Ia-03";
import Ak01Asesor from "@/pages/asesor/Ak-01";
import Ak02Asesor from "@/pages/asesor/Ak-02";
import Ak03Asesor from "@/pages/asesor/Ak-03";
import Ak05Asesor from "@/pages/asesor/Ak-05";
import Ia05CAsesor from "@/pages/asesor/Ia-05-C";
import DashboardPenilaian from "@/pages/asesor/DashboardPenilaian";
import BiodataAsesor from "@/pages/asesor/BiodataAsesor";
import IA05Assessor from "@/pages/asesor/ia-05";
import RecapAssessment from "@/pages/asesor/RecapAssessment";
import Ia01Asesi from "@/pages/asesi/Ia-01";
import Ia01AsesiDetail from "@/pages/asesi/Ia-01-Detail";
import ResultAssessment from "@/pages/admin/ResultAssessment";
import EditMUK from "@/pages/admin/EditMuk";
import RecapAssessmentAdmin from "@/pages/admin/RecapAssessment";
import DashboardAsesmenMandiriAdmin from "@/pages/admin/DashboardAsesmenMandiri";
import AssessmentAdminProvider from "@/components/AssessmentAdminProvider";
import BiodataProtectedRoute from "@/components/BiodataProtectedRoute";
import AsesorIndexRoute from "@/components/AsesorIndexRoute";
import ResultAsesiAssessmentAdmin from "@/pages/admin/ResultAsesiAssessment";
import PersetujuanAdmin from "@/pages/admin/Persetujuan";

const router = createBrowserRouter(
	[
		{
			path: paths.root,
			element: <Outlet />,
			children: [
				{ index: true, element: <Navigate to={paths.auth.login} replace /> },
				// legacy path for older links to APL-02 (accepts id param)
				{ path: "/apl-02/:id", element: <Apl02Asesi /> },
				// legacy/alternate path for assesmen aktif (avoid 404 on older links)
				{ path: "/asesmen-aktif-asesi", element: <AsessmentAktif /> },
				// assessor legacy path (some links point here instead of the new /asesor/... path)
				{ path: "/asesmen-aktif-asesor", element: <DashboardAsesor /> },

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
						{ path: paths.auth.register, element: <RegisterForm /> },
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
						{ path: paths.admin.biodata, element: <BioDataAdmin /> },
						{
							element: <BiodataAdminProtectedRoute><Outlet /></BiodataAdminProtectedRoute>,
							children: [
								{ index: true, element: <DashboardAdmin /> },
								{ path: paths.admin.kelolaUser, element: <KelolaUser /> },
								{ path: paths.admin.kelolaAkunAsesi, element: <KelolaAkunAsesi /> },
								{ path: paths.admin.recapAssessmentAdminPattern, element: <RecapAssessmentAdmin /> },
								{
									path: paths.admin.resultAssessment.root,
									element: (
										<AssessmentAdminProvider>
											<Outlet />
										</AssessmentAdminProvider>
									),
									children: [
										{ index: true, element: <ResultAssessment /> },
										{ path: paths.admin.resultAssessment.dashboardPattern, element: <DashboardAsesmenMandiriAdmin /> },
										{ path: paths.admin.resultAssessment.resultAsesiPattern, element: <ResultAsesiAssessmentAdmin /> }
									],
								},
								{
									path: paths.admin.resultAssessment.dashboardPattern,
									element: <DashboardAsesmenMandiriAdmin />
								},
								{
									path: paths.admin.resultAssessment.resultAsesiPattern,
									element: <ResultAsesiAssessmentAdmin />
								}
							],
						},
						// { path: paths.admin.recapAssessmentAdminPattern, element: <RecapAssessmentAdmin /> },
						// {
						// 	path: paths.admin.detailAssessmentAdminPattern,
						// 	element: <DetailAssessmentAdmin />,
						// },
						{ path: paths.admin.editAsesor, element: <EditAsesor /> },
						{ path: paths.admin.createAsesor, element: <EditAsesor /> },
						{ path: paths.admin.editAsesorPattern, element: <EditAsesor /> },
						{ path: paths.admin.editAsessi, element: <EditAsessi /> },
						{ path: "/admin/edit-asesi/:id", element: <EditAsesi /> },
						{
							path: paths.admin.kelolaAkunAsesor,
							element: <KelolaAkunAsesor />,
						},
						{ path: paths.admin.editAsesi, element: <EditAsesi /> },
						{ path: paths.admin.verifikasi, element: <VerifikasiPage /> },
						{ path: paths.admin.persetujuan, element: <PersetujuanAdmin /> },
						{ // MUK routes grouped under /admin/muk
							path: paths.admin.muk.root,
							children: [
								{ index: true, element: <KelolaMUK /> },
								{ path: "tambah", element: <TambahMUK /> },
								{ path: "edit/:id_assessment", element: <EditMUK /> },
							],
						},
						// Other admin routes (siblings of /admin/muk)
						{ path: paths.admin.kelolaJurusan, element: <KelolaJurusan /> },
						{ path: paths.admin.kelolaJadwal, element: <KelolaJadwal /> },
						{ path: paths.admin.tambahJadwal, element: <TambahJadwal /> },
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
									element: <Apl02Asesi />,
								},
								{
									path: paths.asesi.assessment.apl02DetailPattern,
									element: <Apl02Detail />,
								},
								{
									path: paths.asesi.assessment.ia01Pattern,
									element: <Ia01Asesi />,
								},
								{
									path: paths.asesi.assessment.ia01AsesiDetailPattern,
									element: <Ia01AsesiDetail />,
								},
								{
									path: paths.asesi.assessment.ia02Pattern,
									element: <Ia02Asesi />,
								},
								{
									path: paths.asesi.assessment.ia03Pattern,
									element: <Ia03Asesi />,
								},
								{
									path: paths.asesi.assessment.ia05Pattern,
									element: <Ia05Asesi />,
								},
								{
									path: paths.asesi.assessment.ia05CAssesseePattern,
									element: <Ia05CAssessee />,
								},
								{
									path: paths.asesi.assessment.ak01Pattern,
									element: <Ak01Asesi />,
								},
								{
									path: paths.asesi.assessment.ak02Pattern,
									element: <Ak02Asesi />,
								},
								{
									path: paths.asesi.assessment.ak03Pattern,
									element: <Ak03Asesi />,
								},
								{
									path: paths.asesi.assessment.ak04Pattern,
									element: <Ak04Asesi />,
								},
								{
									path: paths.asesi.assessment.ak05Pattern,
									element: <Ak05Asesi />,
								},
							],
						},
						{ path: paths.asesi.asesmenDiikuti, element: <AsessmentAktif /> },
						{ path: paths.asesi.ak03, element: <Ak03Asesi /> },
						{ path: paths.asesi.ak04, element: <Ak04Asesi /> },
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
					// Biodata route - tidak perlu BiodataProtectedRoute
					{ path: paths.asesor.biodata, element: <BiodataAsesor /> },
					
					// Assessment routes dengan BiodataProtectedRoute
					{
						path: paths.asesor.assessment.root,
						element: (
							<BiodataProtectedRoute>
								<AssessmentAsesorProvider>
									<Outlet />
								</AssessmentAsesorProvider>
							</BiodataProtectedRoute>
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
								element: <Apl02Asesor />,
							},
							{
								path: paths.asesor.assessment.cekApl02DetailPattern,
								element: <Apl02DetailAsesor />,
							},
							{
								path: paths.asesor.assessment.ia01Pattern,
								element: <Ia01Asesor />,
							},
							{
								path: paths.asesor.assessment.ia01DetailPattern,
								element: <Ia01DetailAsesor />,
							},
							{
								path: paths.asesor.assessment.ia02Pattern,
								element: <Ia02Asesor />,
							},
							{
								path: paths.asesor.assessment.ia03Pattern,
								element: <Ia03Asesor />,
							},
							{
								path: paths.asesor.assessment.ia05Pattern,
								element: <IA05Assessor />,
							},
							{
								path: paths.asesor.assessment.ak01Pattern,
								element: <Ak01Asesor />,
							},
							{
								path: paths.asesor.assessment.ak02Pattern,
								element: <Ak02Asesor />,
							},
							{
								path: paths.asesor.assessment.ak03Pattern,
								element: <Ak03Asesor />,
							},
							{
								path: paths.asesor.assessment.ak05Pattern,
								element: <Ak05Asesor />,
							},
							{
								path: paths.asesor.assessment.ia05cPattern,
								element: <Ia05CAsesor />,
							},
							{
								path: paths.asesor.assessment.lembarJawabanPattern,
								// element: <LembarJawaban />,
							},
						],
					},
					
					// Index route - redirect based on biodata status
					{ 
						index: true, 
						element: <AsesorIndexRoute />
					},
					{ 
						path: paths.asesor.dashboardAsesor, 
						element: (
							<BiodataProtectedRoute>
								<DashboardAsesor />
							</BiodataProtectedRoute>
						) 
					},
					{
						path: paths.asesor.dashboardPenilaian,
						element: (
							<BiodataProtectedRoute>
								<DashboardPenilaian />
							</BiodataProtectedRoute>
						),
					},
					{ 
						path: paths.asesor.assessmentReceipt, 
						element: (
							<BiodataProtectedRoute>
								<RecapAssessment />
							</BiodataProtectedRoute>
						) 
					},
					{ 
						path: paths.asesor.recapAssessmentPattern, 
						element: (
							<BiodataProtectedRoute>
								<RecapAssessment />
							</BiodataProtectedRoute>
						) 
					},
					{ 
						path: paths.asesor.dataAsesor, 
						element: (
							<BiodataProtectedRoute>
								<DataAsesor />
							</BiodataProtectedRoute>
						) 
					},
				],
			},
			],
		},
	],
	{
		basename: "/twodev-fe",
	}
);

export default router;
