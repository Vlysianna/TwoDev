const routes = {
	root: "/",
	public: {
		root: "/public",
		dataAsesi: "/public/data-asesi/:encodedId",
		dataAsesor: "/public/data-asesor/:encodedId",
	},
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
		resultAssessment: "/admin/result-assessment",
		editAsesor: "/admin/edit-asesor",
		createAsesor: "/admin/asesor/create",
		editAsesorById: (id: string | number) => `/admin/asesor/edit/${id}`,
		editAsesorPattern: "/admin/asesor/edit/:id",
		kelolaAkunAsesor: "/admin/kelola-akun-asesor",
		editAsesi: "/admin/edit-asesi",
		verifikasi: "/admin/verifikasi",
		muk: {
			root: "/admin/muk",
			tambah: "/admin/muk/tambah",
			editPattern: "/admin/muk/edit/:id_assessment",
			edit: (id_assessment: string | number) =>
				`/admin/muk/edit/${id_assessment}`,
		},
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
		dashboardPenilaian: "/asesor/dashboard-penilaian",
		assessment: {
			root: "/asesor/assessment",
			dashboardAsesmenMandiri: (id_assessment: string | number) =>
				`/asesor/assessment/${id_assessment}`,
			dashboardAsesmenMandiriPattern: "/asesor/assessment/:id_assessment",
			faktaIntegritas: (
				id_assessment: string | number,
				id_asesi: string | number
			) => `/asesor/assessment/${id_assessment}/${id_asesi}/fakta-integritas`,
			faktaIntegritasPattern:
				"/asesor/assessment/:id_assessment/:id_asesi/fakta-integritas",
			cekApl02: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/cek-apl-02`,
			cekApl02Pattern: "/asesor/assessment/:id_assessment/:id_asesi/cek-apl-02",
			cekApl02Detail: (
				id_assessment: string | number,
				id_result: string | number,
				id_asesi: string | number,
				id_unit: string | number
			) => `/asesor/assessment/${id_assessment}/${id_result}/${id_asesi}/cek-apl-02-detail/${id_unit}`,
			cekApl02DetailPattern:
				"/asesor/assessment/:id_assessment/:id_result/:id_asesi/cek-apl-02-detail/:id_unit",
			ia01: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/ia-01`,
			ia01Pattern: "/asesor/assessment/:id_assessment/:id_asesi/ia-01",
			ia01Detail: (
				id_assessment: string | number,
				id_result: string | number,
				id_asesi: string | number,
				id_unit: string | number
			) =>
				`/asesor/assessment/${id_assessment}/${id_result}/${id_asesi}/ia-01-detail/${id_unit}`,
			ia01DetailPattern:
				"/asesor/assessment/:id_assessment/:id_result/:id_asesi/ia-01-detail/:id_unit",
			ia02: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/ia-02`,
			ia02Pattern: "/asesor/assessment/:id_assessment/:id_asesi/ia-02",
			ia05: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/ia-05`,
			ia05Pattern: "/asesor/assessment/:id_assessment/:id_asesi/ia-05",
			ia03: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/ia-03`,
			ia03Pattern: "/asesor/assessment/:id_assessment/:id_asesi/ia-03",
			ak01: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/ak-01`,
			ak01Pattern: "/asesor/assessment/:id_assessment/:id_asesi/ak-01",
			ak02: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/ak-02`,
			ak02Pattern: "/asesor/assessment/:id_assessment/:id_asesi/ak-02",
			ak05: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/ak-05`,
			ak05Pattern: "/asesor/assessment/:id_assessment/:id_asesi/ak-05",
			dataSertifikasi: (
				id_assessment: string | number,
				id_asesi: string | number
			) => `/asesor/assessment/${id_assessment}/${id_asesi}/data-sertifikasi`,
			dataSertifikasiPattern:
				"/asesor/assessment/:id_assessment/:id_asesi/data-sertifikasi",
			ia05c: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/ia-05-c`,
			ia05cPattern: "/asesor/assessment/:id_assessment/:id_asesi/ia-05-c",
			lembarJawaban: (
				id_assessment: string | number,
				id_asesi: string | number
			) => `/asesor/assessment/${id_assessment}/${id_asesi}/lembar-jawaban`,
			lembarJawabanPattern:
				"/asesor/assessment/:id_assessment/:id_asesi/lembar-jawaban",
		},
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
			apl02: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/apl-02`,
			apl02Pattern: "/asesi/assessment/:id_assessment/:id_asesor/apl-02",
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
			ia01Asesi: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ia-01`,
			ia01Pattern: "/asesi/assessment/:id_assessment/:id_asesor/ia-01",
			ia01AsesiDetail: (
				id_assessment: string | number,
				id_result: string | number,
				id_asesor: string | number,
				id_unit: string | number
			) =>
				`/asesi/assessment/${id_assessment}/${id_result}/${id_asesor}/ia-01-detail/${id_unit}`,
			ia01AsesiDetailPattern:
				"/asesi/assessment/:id_assessment/:id_result/:id_asesor/ia-01-detail/:id_unit",
			ia02: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ia-02`,
			ia02Pattern: "/asesi/assessment/:id_assessment/:id_asesor/ia-02",
			ia05: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ia-05`,
			ia05Pattern: "/asesi/assessment/:id_assessment/:id_asesor/ia-05",
			Ia05CAssessee: (
				id_assessment: string | number,
				id_asesor: string | number
			) => `/asesi/assessment/${id_assessment}/${id_asesor}/ia-05-c`,
			ia05CAssesseePattern:
				"/asesi/assessment/:id_assessment/:id_asesor/ia-05-c",
			ak01: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ak-01`,
			ak01Pattern: "/asesi/assessment/:id_assessment/:id_asesor/ak-01",
			ak03: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ak-03`,
			ak03Pattern: "/asesi/assessment/:id_assessment/:id_asesor/ak-03",
			ak04: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ak-04`,
			ak04Pattern: "/asesi/assessment/:id_assessment/:id_asesor/ak-04",
		},
		asesmenDiikuti: "/asesi/asesmen/diikuti",
		ak04: "/asesi/ak-04",
		ak03: "/asesi/ak-03",
		dataAsesi: "/asesi/data-asesi",
	},
};

export default routes;
