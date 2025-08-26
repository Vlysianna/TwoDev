const routes = {
	root: "/",
	dashboard: {
		about: "/about",
		struktur: "/struktur",
		pengelolaSDM: "/pengelola-sdm",
		skema: "/skema",
		tempatUji: "/tempat-uji",
		prosedurPendaftaran: "/prosedur-pendaftaran",
		berita: "/berita",
		galeri: "/galeri",
		contact: "/contact",
		asesor: "/asesor",
		test: "/test",
	},
	auth: {
		root: "/auth",
		login: "/auth/login",
		register: "/auth/register",
		registerAsesi: "/auth/register-asesi",
	},
	admin: {
		root: "/admin",
		kelolaAkunAsesi: "/admin/kelola-akun-asesi",
		kelolaMUK: "/admin/kelola-muk",
		editAsesor: "/admin/edit-asesor",
		createAsesor: "/admin/asesor/create",
		editAsesorById: (id: string | number) => `/admin/asesor/edit/${id}`,
		editAsesorPattern: "/admin/asesor/edit/:id",
		kelolaAkunAsesor: "/admin/kelola-akun-asesor",
		editAsesi: "/admin/edit-asesi",
		verifikasi: "/admin/verifikasi",
		tambahSkema: "/admin/tambahskema",
		kelolaJurusan: "/admin/kelola-jurusan",
		okupasi: {
			root: "/admin/okupasi",
			index: "/admin/okupasi",
			edit: (id: string | number) => `/admin/okupasi/edit/${id}`,
			editPattern: "/admin/okupasi/edit/:id",
		},
		editAsessi: "/admin/edit-asesi",
		kelolaJadwal: "/admin/kelola-jadwal",
		tambahJadwal: "/admin/tambah-jadwal",
		apl02: "/admin/apl-02",
	},
	asesor: {
		root: "/asesor",
		dashboard: "/asesor/dashboard",
		template: "/asesor/template",
		template2: "/asesor/template2",
		biodata: "/asesor/biodata",
		dashboardAsesor: "/asesor/dashboard-asesor",
		cekAsesmenMandiri: "/asesor/cek-apl-02",
		cekAsesmenMandiriDetail: "/asesor/cek-apl-02-detail",
		persetujuanAsesmenKerahasiaanAsesor:
			"/asesor/persetujuan-asesmen-kerahasiaan-asesor",
		faktaIntegritas: "/asesor/fakta-integritas",
		fria03: "/asesor/fr-ia-03",
		fiia: "/asesor/fi.ia.01",
		fiiadetail: "/asesor/fi.ia.01-detail",
		frak02: "/asesor/fr.ak.02",
		apl01: "/asesor/apl-01",
		dataSertifikasi: "/asesor/data-sertifikasi",
		hasil: "/asesor/hasil",
		hasilAsesmen: "/asesor/hasil-asesmen",
		frak05: "/asesor/fr.ak.05",
		asesmenMandiri: "/asesor/asesmen-mandiri",
		persetujuanKerahasiaan: "/asesor/persetujuan-kerahasiaan",
		lembarJawaban: "/asesor/lembar-jawaban",
		assessmentRecord: "/asesor/assessment-record",
		assesmentReport: "/asesor/assesment-report",
		dataAsesor: "/asesor/data-asesor",
	},
	asesi: {
		root: "/asesi",
		dashboard: "/asesi",
		assessment: {
			root: "/asesi/assessment",
			apl01: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/apl-01`,
			apl01Pattern: "/asesi/assessment/:id_assessment/:id_asesor/apl-01",
			dataSertifikasi: (
				id_assessment: string | number,
				id_asesor: string | number
			) => `/asesi/assessment/${id_assessment}/${id_asesor}/data-sertifikasi`,
			dataSertifikasiPattern:
				"/asesi/assessment/:id_assessment/:id_asesor/data-sertifikasi",
			apl02: "/asesi/assessment/apl-02",
			asesmenMandiri: (
				id_assessment: string | number,
				id_asesor: string | number
			) => `/asesi/assessment/${id_assessment}/${id_asesor}/asesmen-mandiri`,
			asesmenMandiriPattern:
				"/asesi/assessment/:id_assessment/:id_asesor/asesmen-mandiri",
			asesmenMandiriDetail: (
				id_assessment: string | number,
				id_asesor: string | number,
				id_unit: string | number
			) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/asesmen-mandiri/${id_unit}`,
			asesmenMandiriDetailPattern:
				"/asesi/assessment/:id_assessment/:id_asesor/asesmen-mandiri/:id_unit",
			frak03: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/fr.ak.03`,
			frak03Pattern: "/asesi/assessment/:id_assessment/:id_asesor/fr.ak.03",
		},
		asesmenDiikuti: "/asesi/asesmen/diikuti",
		umpanBalik: "/asesi/umpan-balik",
		bandingAsesmen: "/asesi/banding-asesmen",
		persetujuanAsesmenKerahasiaan: "/asesi/persetujuan-asesmen-kerahasiaan",
		fria02: "/asesi/fr-ia-02",
		asesmenPilihanGanda: "/asesi/asesmen-pilihan-ganda",
		dataAsesi: "/asesi/data-asesi",
	},
};

export default routes;
