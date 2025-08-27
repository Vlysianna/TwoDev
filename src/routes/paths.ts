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
		biodata: "/asesor/biodata",
		dashboardAsesor: "/asesor/dashboard-asesor",
		dashboardAsesmenMandiri: "/asesor/dashboard-asesmen-mandiri",
		dashboardPenilaian: "/asesor/dashboard-penilaian",
		faktaIntegritas: "/asesor/fakta-integritas",
		cekApl02: "/asesor/cek-apl-02",
		cekApl02Detail: "/asesor/cek-apl-02-detail",
		ia01: "/asesor/ia-01",
		ia01Detail: "/asesor/ia-01-detail",
		ia03: "/asesor/ia-03",
		cekAk01: "/asesor/cek-ak-01",
		ak02: "/asesor/ak-02",
		ak05: "/asesor/ak-05",
		dataSertifikasi: "/asesor/data-sertifikasi",
		hasilAsesmen: "/asesor/hasil-asesmen",
		lembarJawaban: "/asesor/lembar-jawaban",
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
			apl02: (
				id_assessment: string | number,
				id_asesor: string | number
			) => `/asesi/assessment/${id_assessment}/${id_asesor}/apl-02`,
			apl02Pattern:
				"/asesi/assessment/:id_assessment/:id_asesor/apl-02",
			apl02_detail: (
				id_assessment: string | number,
				id_asesor: string | number,
				id_unit: string | number
			) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/apl-02-detail/${id_unit}`,
			apl02DetailPattern:
				"/asesi/assessment/:id_assessment/:id_asesor/apl-02-detail/:id_unit",
			frak03: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/fr.ak.03`,
			frak03Pattern: "/asesi/assessment/:id_assessment/:id_asesor/fr.ak.03",
			ia02: (
				id_assessment: string | number,
				id_asesor: string | number
			) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ia-02`,
			ia02Pattern: "/asesi/assessment/:id_assessment/:id_asesor/ia-02",
			ia05: (
				id_assessment: string | number,
				id_asesor: string | number
			) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ia-05`,
			ia05Pattern: "/asesi/assessment/:id_assessment/:id_asesor/ia-05",
			ak01: (
				id_assessment: string | number,
				id_asesor: string | number
			) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ak-01`,
			ak01Pattern: "/asesi/assessment/:id_assessment/:id_asesor/ak-01",
		},
		asesmenDiikuti: "/asesi/asesmen/diikuti",
		ak04: "/asesi/ak-04",
		ak03: "/asesi/ak-03",
		dataAsesi: "/asesi/data-asesi",
	},
};

export default routes;
