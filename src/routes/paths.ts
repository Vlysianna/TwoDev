import Ia05CAssessee from "@/pages/asesi/Ia-05-C";

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
		tambahMuk: "/admin/tambah-muk",
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
				id_asesi: string | number
			) => `/asesor/assessment/${id_assessment}/${id_asesi}/cek-apl-02-detail`,
			cekApl02DetailPattern:
				"/asesor/assessment/:id_assessment/:id_asesi/cek-apl-02-detail",
			ia01: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/ia-01`,
			ia01Pattern: "/asesor/assessment/:id_assessment/:id_asesi/ia-01",
			ia01Detail: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/ia-01-detail`,
			ia01DetailPattern:
				"/asesor/assessment/:id_assessment/:id_asesi/ia-01-detail",
			ia03: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/ia-03`,
			ia03Pattern: "/asesor/assessment/:id_assessment/:id_asesi/ia-03",
			cekAk01: (id_assessment: string | number, id_asesi: string | number) =>
				`/asesor/assessment/${id_assessment}/${id_asesi}/cek-ak-01`,
			cekAk01Pattern: "/asesor/assessment/:id_assessment/:id_asesi/cek-ak-01",
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
			hasilAsesmen: (
				id_assessment: string | number,
				id_asesi: string | number
			) => `/asesor/assessment/${id_assessment}/${id_asesi}/hasil-asesmen`,
			hasilAsesmenPattern:
				"/asesor/assessment/:id_assessment/:id_asesi/hasil-asesmen",
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
			ia02: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ia-02`,
			ia02Pattern: "/asesi/assessment/:id_assessment/:id_asesor/ia-02",
			ia05: (id_assessment: string | number, id_asesor: string | number) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ia-05`,
			ia05Pattern: "/asesi/assessment/:id_assessment/:id_asesor/ia-05",
			Ia05CAssessee: (
				id_assessment: string | number,
				id_asesor: string | number
			) =>
				`/asesi/assessment/${id_assessment}/${id_asesor}/ia-05-c`,
			ia05CAssesseePattern: "/asesi/assessment/:id_assessment/:id_asesor/ia-05-c",
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
