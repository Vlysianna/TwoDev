import { useState, useEffect, use } from "react";
import {
	ArrowLeft,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	Monitor,
	QrCode,
	Save,
} from "lucide-react";
import NavbarAsesor from "@/components/NavAsesor";
import api from "@/helper/axios";
import paths from "@/routes/paths";
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import { QRCodeCanvas } from "qrcode.react";
import { getAssessorUrl, getAssesseeUrl } from "@/lib/hashids";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import ConfirmModal from "@/components/ConfirmModal";
import { formatDateInputLocal } from "@/helper/format-date";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { IncompleteGroup } from "@/model/ia01-model";

export default function Ia01() {
	const { id_schedule, id_asesor, id_result, id_asesi } = useAssessmentParams
		? useAssessmentParams()
		: {};
	const [selectedKPekerjaan, setSelectedKPekerjaan] = useState<string>("");
	const [groupList, setGroupList] = useState<string[]>([]);
	const [recommendation, setRecommendation] = useState<
		"kompeten" | "belum" | null
	>(null);
	const [canSave, setCanSave] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [assessment, setAssessment] = useState<any>(null);
	const [unitData, setUnitData] = useState<any[]>([]);
	const [completedUnits, setCompletedUnits] = useState<number>(0);
	const [resultData, setResultData] = useState<any>(null);
	const [unitNumberMap, setUnitNumberMap] = useState<Record<number, number>>(
		{}
	);
	const [searchParams, setSearchParams] = useSearchParams();

	// State untuk data incomplete criteria
	const [incompleteCriteria, setIncompleteCriteria] = useState<
		IncompleteGroup[]
	>([]);

	const [loadingIncomplete, setLoadingIncomplete] = useState(false);

	// State untuk dropdown selection
	const [selectedGroup, setSelectedGroup] = useState<IncompleteGroup | null>(
		null
	);
	const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
	const [selectedElement, setSelectedElement] = useState<Element | null>(null);
	const [selectedCriteria, setSelectedCriteria] =
		useState<IncompleteCriteria | null>(null);

	// State untuk available options
	const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
	const [availableElements, setAvailableElements] = useState<Element[]>([]);
	const [availableCriterias, setAvailableCriterias] = useState<
		IncompleteCriteria[]
	>([]);

	// Local state untuk IA-01 header fields
	const [groupField, setGroupField] = useState("");
	const [unitField, setUnitField] = useState("");
	const [elementField, setElementField] = useState("");
	const [kukField, setKukField] = useState("");
	const [assesmentDate, setAssesmentDate] = useState("");

	const [assesseeQrValue, setAssesseeQrValue] = useState("");
	const [assessorQrValue, setAssessorQrValue] = useState("");
	const [saveProcessing, setSaveProcessing] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [qrProcessing, setQrProcessing] = useState(false);
	const [processError, setProcessError] = useState<string | null>(null);
	const [processSuccess, setProcessSuccess] = useState<string | null>(null);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [pendingValue, setPendingValue] = useState<string>("");

	// Fungsi untuk mengambil data incomplete criteria
	const fetchIncompleteCriteria = async () => {
		if (!id_result) return;

		setLoadingIncomplete(true);
		try {
			const response = await api.get(
				`/assessments/ia-01/result/incomplete-criteria/${id_result}`
			);

			if (response.data.success) {
				setIncompleteCriteria(response.data.data);
			}
		} catch (error: any) {
			console.error("fetchIncompleteCriteria error:", error);
			setError("Gagal memuat data kriteria yang belum kompeten");
		} finally {
			setLoadingIncomplete(false);
		}
	};

	// Handler untuk memilih kelompok pekerjaan
	const handleGroupChange = (groupName: string) => {
		const group = incompleteCriteria.find((g) => g.name === groupName);
		setSelectedGroup(group || null);
		setSelectedUnit(null);
		setSelectedElement(null);
		setSelectedCriteria(null);

		setGroupField(groupName);
		setUnitField("");
		setElementField("");
		setKukField("");

		// Reset saved status karena ada perubahan
		setIsSaved(false);

		// Set available units berdasarkan kelompok pekerjaan yang dipilih
		if (group) {
			setAvailableUnits(group.units);
		} else {
			setAvailableUnits([]);
		}
		setAvailableElements([]);
		setAvailableCriterias([]);
	};

	// Handler untuk memilih unit
	const handleUnitChange = (unitId: number) => {
		const unit = availableUnits.find((u) => u.id === unitId);
		setSelectedUnit(unit || null);
		setSelectedElement(null);
		setSelectedCriteria(null);

		if (unit) {
			setUnitField(`${unit.no}. ${unit.title} (${unit.unit_code})`);
			setAvailableElements(unit.elements);
		} else {
			setUnitField("");
			setAvailableElements([]);
		}
		setElementField("");
		setKukField("");
		setAvailableCriterias([]);
		setIsSaved(false);
	};

	// Handler untuk memilih elemen
	const handleElementChange = (elementId: number) => {
		const element = availableElements.find((e) => e.id === elementId);
		setSelectedElement(element || null);
		setSelectedCriteria(null);

		if (element) {
			setElementField(`${element.no}. ${element.title}`);
			setAvailableCriterias(element.criterias);
		} else {
			setElementField("");
			setAvailableCriterias([]);
		}
		setKukField("");
		setIsSaved(false);
	};

	// Handler untuk memilih KUK
	const handleCriteriaChange = (criteriaId: number) => {
		const criteria = availableCriterias.find((c) => c.id === criteriaId);
		setSelectedCriteria(criteria || null);

		if (criteria) {
			setKukField(`${criteria.no}. ${criteria.description}`);
		} else {
			setKukField("");
		}
		setIsSaved(false);
	};

	// Cek apakah ada perubahan pada header atau rekomendasi
	const isHeaderChanged = () => {
		if (!resultData?.ia01_header) return false;
		return (
			groupField !== (resultData.ia01_header.group || "") ||
			unitField !== (resultData.ia01_header.unit || "") ||
			elementField !== (resultData.ia01_header.element || "") ||
			kukField !== (resultData.ia01_header.kuk || "") ||
			(typeof resultData.ia01_header.is_competent === "boolean" &&
				(recommendation === "kompeten"
					? true
					: recommendation === "belum"
					? false
					: null) !== resultData.ia01_header.is_competent)
		);
	};

	// Handler simpan header IA-01
	const handleSaveHeader = async () => {
		if (!id_result) return;
		const completion =
			unitData.length > 0
				? `${Math.round((completedUnits / unitData.length) * 100)}%`
				: "0%";
		if (completion !== "100%") {
			setProcessError(
				"Isilah semua unit terlebih dahulu sebelum menyimpan hasil rekomendasi."
			);
			return;
		}

		setSaveProcessing(true);
		setProcessError(null);
		setProcessSuccess(null);

		try {
			await api.post(`/assessments/ia-01/result/send-header`, {
				result_id: Number(id_result),
				group: groupField,
				unit: unitField,
				element: elementField,
				kuk: kukField,
				is_competent: recommendation === "kompeten",
			});

			setIsSaved(true);
			setProcessSuccess("Rekomendasi berhasil disimpan");

			// Fetch data terbaru untuk sync
			await fetchResultData();

			setTimeout(() => setProcessSuccess(null), 3000);
		} catch (err) {
			setProcessError("Gagal menyimpan rekomendasi IA-01");
			setIsSaved(false);
		} finally {
			setSaveProcessing(false);
		}
	};

	// Handler generate QR code
	const handleGenerateQRCode = async () => {
		if (!id_asesor || !isSaved) return;
		setQrProcessing(true);
		setProcessError(null);
		setProcessSuccess(null);

		try {
			const response = await api.put(
				`/assessments/ia-01/result/assessor/${id_result}/approve`
			);
			if (response.data.success) {
				const qrValue = getAssessorUrl(Number(id_asesor));
				setAssessorQrValue(qrValue);
				setProcessSuccess("QR Code berhasil digenerate");

				// Hanya fetch data untuk update status QR, tapi jangan reset selection
				fetchResultDataForQR();

				setTimeout(() => setProcessSuccess(null), 3000);
			}
		} catch (error) {
			setProcessError("Gagal menyetujui sebagai asesor");
		} finally {
			setQrProcessing(false);
		}
	};

	// Fungsi khusus untuk fetch data QR saja tanpa reset selection
	const fetchResultDataForQR = async () => {
		if (!id_result) return;
		try {
			const response = await api.get(`/assessments/ia-01/result/${id_result}`);

			if (response.data.success) {
				// Hanya update data yang berkaitan dengan QR, jangan reset selection
				setResultData((prev) => ({
					...prev,
					...response.data.data,
					ia01_header: {
						...prev?.ia01_header,
						...response.data.data.ia01_header,
					},
				}));

				if (response.data.data.ia01_header?.approved_assessee && id_asesi) {
					setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
				}

				if (response.data.data.ia01_header?.approved_assessor) {
					setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
				}
			}
		} catch (error) {
			console.error("fetchResultDataForQR error:", error);
		}
	};

	// Tambahkan juga useEffect untuk handle ketika rekomendasi berubah
	useEffect(() => {
		if (recommendation === "kompeten") {
			setGroupField("-");
			setUnitField("-");
			setElementField("-");
			setKukField("-");
			setSelectedGroup(null);
			setSelectedUnit(null);
			setSelectedElement(null);
			setSelectedCriteria(null);
			setAvailableUnits([]);
			setAvailableElements([]);
			setAvailableCriterias([]);
		} else if (recommendation === "belum") {
			// Reset fields tapi biarkan user memilih dari dropdown
			setGroupField("");
			setUnitField("");
			setElementField("");
			setKukField("");
			setSelectedGroup(null);
			setSelectedUnit(null);
			setSelectedElement(null);
			setSelectedCriteria(null);
			setAvailableUnits([]);
			setAvailableElements([]);
			setAvailableCriterias([]);
		}
	}, [recommendation]);

	const handleSaveHeaderClick = () => {
		setPendingValue(
			recommendation === "kompeten" ? "Kompeten" : "Belum Kompeten"
		);
		setShowConfirmModal(true);
	};

	const handleConfirmSave = async () => {
		setShowConfirmModal(false);
		await handleSaveHeader();
	};

	// TAMBAHKAN state untuk track initial load
	const [initialLoad, setInitialLoad] = useState(true);

	useEffect(() => {}, [id_result]);

	useEffect(() => {
		const loadData = async () => {
			await fetchResultData();
			setInitialLoad(false);
		};

		if (id_result) {
			loadData();
		}

		if (id_result) {
			fetchUnitData();
			fetchIncompleteCriteria();
		}
	}, [id_schedule, id_result]);

	useEffect(() => {
		if (resultData) 
			fetchAssessment();
	}, [resultData])

	useEffect(() => {
		if (unitData && unitData.length > 0) {
			const completed = unitData.filter((unit: any) => unit.finished);
			setCompletedUnits(completed.length);
		}
	}, [unitData]);

	const fetchAssessment = async () => {
		try {
			setLoading(true);
			const response = await api.get(`/assessments/${resultData.assessment.id}`);
			if (response.data.success) {
				setAssessment(response.data.data);
			}
		} catch (error: any) {
			setError("Gagal memuat data asesmen");
			console.error("fetchAssessment error:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchUnitData = async () => {
		if (!id_result) return;
		try {
			const response = await api.get(`/assessments/ia-01/units/${id_result}`);

			if (response.data.success) {
				const groupNames = response.data.data.map((group: any) => group.name);
				setGroupList(groupNames);

				if (groupNames.length > 0) {
					setSelectedKPekerjaan(groupNames[0]);
				}

				const flattenedUnits = response.data.data.flatMap((group: any) =>
					group.units.map((unit: any) => ({
						id: unit.id,
						title: unit.title,
						unit_code: unit.unit_code,
						finished: unit.finished,
						status: unit.status,
						progress: unit.progress,
						group_name: group.name,
						kPekerjaan: group.name,
					}))
				);

				setUnitData(flattenedUnits);

				const numberMap: Record<number, number> = {};
				flattenedUnits.forEach((unit: any, index: number) => {
					numberMap[unit.id] = index + 1;
				});
				setUnitNumberMap(numberMap);
			}
		} catch (error: any) {
			setError("Gagal memuat unit kompetensi");
			console.error("fetchUnitData error:", error);
		}
	};

	const fetchResultData = async () => {
		if (!id_result) return;
		try {
			const response = await api.get(`/assessments/ia-01/result/${id_result}`);

			if (response.data.success) {
				setResultData(response.data.data);

				if (response.data.data.ia01_header?.approved_assessee && id_asesi) {
					setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
				}

				if (response.data.data.ia01_header?.approved_assessor) {
					setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
				}

				// HANYA sync fields jika belum ada perubahan dari user
				if (response.data.data.ia01_header && !isHeaderChanged()) {
					setGroupField(response.data.data.ia01_header.group || "");
					setUnitField(response.data.data.ia01_header.unit || "");
					setElementField(response.data.data.ia01_header.element || "");
					setKukField(response.data.data.ia01_header.kuk || "");
					setAssesmentDate(response.data.data.schedule.end_date || "");

					// Sync recommendation
					if (
						typeof response.data.data.ia01_header.is_competent === "boolean"
					) {
						setRecommendation(
							response.data.data.ia01_header.is_competent ? "kompeten" : "belum"
						);
					}
				}
			}
		} catch (error) {
			console.error("fetchResultData error:", error);
		}
	};

	// PERBAIKI juga useEffect untuk sync dropdown selection
	useEffect(() => {
		if (
			resultData?.ia01_header &&
			incompleteCriteria.length > 0 &&
			recommendation === "belum"
		) {
			syncDropdownSelection(resultData.ia01_header);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resultData, incompleteCriteria, recommendation]);

	// Fungsi untuk sync dropdown selection
	const syncDropdownSelection = (ia01Header: any) => {
		if (!ia01Header || recommendation !== "belum") return;

		// Sync kelompok pekerjaan
		const savedGroup = incompleteCriteria.find(
			(group) => group.name === ia01Header.group
		);
		if (savedGroup && !selectedGroup) {
			setSelectedGroup(savedGroup);
			setAvailableUnits(savedGroup.units);

			// Sync unit
			const savedUnit = savedGroup.units.find((unit) => {
				const unitText = `${unit.no}. ${unit.title} (${unit.unit_code})`;
				return unitText === ia01Header.unit;
			});
			if (savedUnit && !selectedUnit) {
				setSelectedUnit(savedUnit);
				setAvailableElements(savedUnit.elements);

				// Sync elemen
				const savedElement = savedUnit.elements.find((element) => {
					const elementText = `${element.no}. ${element.title}`;
					return elementText === ia01Header.element;
				});
				if (savedElement && !selectedElement) {
					setSelectedElement(savedElement);
					setAvailableCriterias(savedElement.criterias);

					// Sync KUK
					const savedCriteria = savedElement.criterias.find((criteria) => {
						const criteriaText = `${criteria.no}. ${criteria.description}`;
						return criteriaText === ia01Header.kuk;
					});
					if (savedCriteria && !selectedCriteria) {
						setSelectedCriteria(savedCriteria);
					}
				}
			}
		}
	};

	// Juga panggil sync ketika recommendation berubah ke 'belum'
	useEffect(() => {
		if (
			recommendation === "belum" &&
			resultData?.ia01_header &&
			incompleteCriteria.length > 0
		) {
			syncDropdownSelection(resultData.ia01_header);
		}
	}, [recommendation, resultData, incompleteCriteria]);

	useEffect(() => {
		if (unitData.length > 0) {
			
			// console.log(completedUnits === unitData.length)
			console.log(isSaved)
			if (unitData.length > 0 && completedUnits === unitData.length && !assessorQrValue) {
				setCanSave(true);
			} else {
				setCanSave(false);
				return;
			}

			if (assessorQrValue == "") {
				if (incompleteCriteria.length > 0) {
					setRecommendation("belum");
				} else {
					setRecommendation("kompeten");
				}
			} else {
				setRecommendation("kompeten");
			}
		} else {
			setCanSave(false);
		}
	}, [assessorQrValue, completedUnits, incompleteCriteria, unitData]);

	useEffect(() => {
		if (recommendation === "kompeten") {
			setGroupField("-");
			setUnitField("-");
			setElementField("-");
			setKukField("-");
			setSelectedGroup(null);
			setSelectedUnit(null);
			setSelectedElement(null);
			setSelectedCriteria(null);
			setAvailableUnits([]);
			setAvailableElements([]);
			setAvailableCriterias([]);
		} else if (recommendation === "belum") {
			// Reset fields tapi biarkan user memilih dari dropdown
			// TAPI jangan reset jika sudah ada data dari API
			if (!resultData?.ia01_header?.group) {
				setGroupField("");
				setUnitField("");
				setElementField("");
				setKukField("");
				setSelectedGroup(null);
				setSelectedUnit(null);
				setSelectedElement(null);
				setSelectedCriteria(null);
				setAvailableUnits([]);
				setAvailableElements([]);
				setAvailableCriterias([]);
			}
		}
	}, [recommendation]);

	const handleRecommendationChange = (value: "kompeten" | "belum") => {
		setRecommendation(value);
	};

	const formattedDate = assesmentDate ? formatDateInputLocal(assesmentDate) : "";

	const getFilteredData = () => {
		return unitData.filter((unit) => unit.group_name === selectedKPekerjaan);
	};
	const filteredData = getFilteredData();

	useEffect(() => {
		if (selectedKPekerjaan) {
			localStorage.setItem("activeGroup", selectedKPekerjaan);
		}
	}, [selectedKPekerjaan]);

	useEffect(() => {
		const groupFromUrl = searchParams.get("group");
		if (groupFromUrl && groupList.includes(groupFromUrl)) {
			setSelectedKPekerjaan(groupFromUrl);
		} else if (groupList.length > 0) {
			setSelectedKPekerjaan(groupList[0]);
		}
	}, [groupList, searchParams]);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm">
					<NavbarAsesor
						title="Ceklis Observasi Aktivitas di Tempat Kerja atau di Tempat Kerja Simulasi - FR-IA-01"
						icon={
							<Link
								to={paths.asesor.assessment.dashboardAsesmenMandiri(
									id_schedule!
								)}
								className="text-gray-500 hover:text-gray-600"
							>
								<ChevronLeft size={20} />
							</Link>
						}
					/>
				</div>

				<main className="m-4">
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<div className="mb-6">
							<div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-4">
								{/* Kiri */}
								<div className="flex flex-col gap-4">
									{/* Judul + Clock */}
									<div className="flex flex-col lg:flex-row lg:items-center gap-3 flex-wrap">
										<h2 className="text-lg font-bold text-gray-800">
											Skema Sertifikasi {assessment?.occupation?.name}
										</h2>
										<div className="flex items-center space-x-2 mt-1 lg:mt-0">
											<Clock className="w-5 h-5 text-gray-400" />
											<span className="text-sm text-gray-600 capitalize">
												{resultData?.tuk || "Sewaktu"}
											</span>
										</div>
									</div>

									{/* Asesi & Asesor */}
									<div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
										<div className="flex flex-wrap gap-2">
											<span className="xs-text mr-1">Asesi:</span>
											<span>{resultData?.assessee?.name || "N/A"}</span>
										</div>
										<div className="flex flex-wrap gap-2">
											<span className="xs-text mr-1">Asesor:</span>
											<span>{resultData?.assessor?.name || "N/A"}</span>
										</div>
									</div>
								</div>

								{/* Kanan */}
								<div className="flex flex-col justify-between items-end gap-4">
									{/* Kode */}
									<span className="px-3 py-1 w-fit rounded text-sm font-medium text-[#E77D35] bg-[#E77D3533]">
										{assessment?.code || "N/A"}
									</span>

									{/* Tanggal */}
									<span className="text-sm text-gray-500">
										{assessment?.date || "24 Oktober 2025 | 07:00 - 15:00"}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-white mt-4 rounded-lg shadow-sm border p-6">
						<div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
							<div className="flex flex-wrap gap-2">
								{groupList.map((tab, idx) => (
									<button
										key={tab} // Key yang unik
										onClick={() => setSelectedKPekerjaan(tab)}
										className={`px-3 lg:px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
											selectedKPekerjaan === tab
												? "bg-[#E77D35] text-white shadow-sm"
												: "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
										}`}
									>
										{tab}
									</button>
								))}
							</div>
							<div className="flex flex-col items-end gap-1">
								<div className="flex items-center justify-between w-full min-w-[220px]">
									<span className="text-sm text-gray-600">Penyelesaian</span>
									<span className="text-sm font-medium text-gray-900">
										{unitData.length > 0
											? `${Math.round(
													(completedUnits / unitData.length) * 100
											  )}%`
											: "0%"}
									</span>
								</div>
								<div className="w-full">
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-[#E77D35] h-2 rounded-full"
											style={{
												width:
													unitData.length > 0
														? `${(completedUnits / unitData.length) * 100}%`
														: "0%",
											}}
										></div>
									</div>
								</div>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
							{filteredData.map((unit: any, index: number) => (
								<div
									key={unit.id}
									className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow"
								>
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-center space-x-2">
											<div className="w-5 h-5 flex items-center justify-center">
												<Monitor size={16} className="text-[#E77D35]" />
											</div>
											<span className="text-sm font-medium text-[#E77D35]">
												Unit kompetensi {unitNumberMap[unit.id] || "N/A"}
											</span>
										</div>
									</div>
									<h3 className="font-medium text-gray-900 mb-2 text-sm leading-tight">
										{unit.title}
									</h3>
									<p className="text-xs text-gray-500 mb-1">{unit.unit_code}</p>
									<p className="text-xs text-gray-400 italic">
										{unit.group_name}
									</p>

									<div className="flex items-center justify-between mt-3">
										{unit.finished ? (
											<span className="bg-[#E77D3533] text-[#E77D35] px-2 py-1 rounded text-xs font-medium">
												Selesai
											</span>
										) : (
											<span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
												Belum selesai
											</span>
										)}
										<Link
											to={
												paths.asesor.assessment.ia01Detail(
													id_schedule ?? "-",
													id_result ?? "-",
													id_asesi ?? "-",
													unit.id
												) + `?group=${encodeURIComponent(selectedKPekerjaan)}`
											}
											className="text-[#E77D35] hover:text-[#E77D35] text-sm flex items-center hover:underline transition-colors"
										>
											Lihat detail
											<ChevronRight size={14} className="ml-1" />
										</Link>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="bg-white mt-4 rounded-lg shadow-sm border p-6">
						{/* Bagian Rekomendasi */}
						<div className="mb-6">
							<h3 className="text-xl font-medium text-gray-900 mb-4">
								Rekomendasi
							</h3>

							<div className="space-y-3 mb-6">
								{!resultData ? (
									<div className="text-gray-500">Memuat rekomendasi...</div>
								) : (
									<>
										<label className="flex items-start space-x-3 cursor-pointer">
											<input
												type="radio"
												name="recommendation"
												checked={recommendation === "kompeten"}
												className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
												disabled
											/>
											<span
												className={`text-sm text-gray-700 leading-relaxed transition-all duration-300
    ${recommendation === "belum" ? "line-through opacity-50" : ""}`}
											>
												Asesi telah memenuhi pencapaian seluruh kriteria unjuk
												kerja, direkomendasikan <strong>KOMPETEN</strong>
											</span>
										</label>
										<label className="flex items-start space-x-3 cursor-pointer">
											<input
												type="radio"
												name="recommendation"
												checked={recommendation === "belum"}
												className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
												disabled
											/>
											<span
												className={`text-sm text-gray-700 leading-relaxed transition-all duration-300
                ${
									recommendation === "kompeten" ? "line-through opacity-50" : ""
								}`}
											>
												Asesi belum memenuhi pencapaian seluruh kriteria unjuk
												kerja, direkomendasikan{" "}
												<strong className="text-red-600">BELUM KOMPETEN</strong>
											</span>
										</label>
									</>
								)}
							</div>
						</div>

						{/* Dua Kolom: Asesi/Asesor dan QR Code */}
						<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8 items-start">
							{/* Kolom Kiri - Asesi dan Asesor */}
							<div className="h-full flex flex-col">
								<div className="mb-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Pada :
									</label>
								</div>
								<div className="d-flex flex-column gap-4 mb-6">
									<div className="text-lg font-medium text-gray-900 mb-4">
										Daftar Tidak Kompeten
									</div>
									<div className="d-flex flex-column">
										<Accordion
											type="multiple"
											defaultValue={["criteria-0"]}
											className="w-full space-y-4"
										>
											{incompleteCriteria.map((criteria, ci) => (
												<AccordionItem
													key={ci}
													value={`criteria-${ci}`}
													className="rounded-lg border border-gray-200 bg-white shadow-sm"
												>
													{/* Criteria Header */}
													<AccordionTrigger className="px-4 py-2 text-base font-semibold text-gray-900">
														{criteria.name}
													</AccordionTrigger>

													<AccordionContent className="space-y-4 m-3">
														{criteria.units.map((unit) => (
															<div
																key={unit.no}
																className="rounded-md border border-gray-200 bg-gray-50 p-3"
															>
																<div>
																	<div className="text-sm font-medium text-gray-800">
																		<span className="font-bold">
																			Unit {unit.no}:
																		</span>{" "}
																		{unit.title}
																	</div>

																	<div className="mt-2 space-y-2 pl-4">
																		{unit.elements.map((element, j) => (
																			<ul key={j} className="space-y-2">
																				<span className="text-sm font-medium text-gray-800">
																					{element.no}. {element.title}
																				</span>
																				{element.criterias.map((c, k) => (
																					<li
																						key={k}
																						className="flex items-start gap-2 rounded-md bg-white px-3 py-2"
																					>
																						<span className="min-w-[40px] text-blue-600 min-w-8">
																							{c.no}
																						</span>
																						<span className="text-gray-700">
																							{c.description}
																						</span>
																					</li>
																				))}
																			</ul>
																		))}
																	</div>
																</div>
															</div>
														))}
													</AccordionContent>
												</AccordionItem>
											))}
										</Accordion>
									</div>
								</div>

								{/* Bagian Asesi dan Asesor */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Asesi */}
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-4">
											Asesi
										</h3>
										<div className="mb-3">
											<input
												type="text"
												value={resultData?.assessee?.name || "-"}
												className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
												readOnly
											/>
										</div>
										<div className="relative mb-4">
											<input
												type="datetime-local"
												value={formattedDate}
												className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
												readOnly
											/>
											<Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
										</div>
									</div>

									{/* Asesor */}
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-4">
											Asesor
										</h3>
										<div className="mb-3">
											<input
												type="text"
												value={resultData?.assessor?.name || "-"}
												className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
												readOnly
											/>
										</div>
										<div className="mb-3">
											<input
												type="text"
												value={resultData?.assessor?.no_reg_met || "-"}
												className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
												readOnly
											/>
										</div>
										<div className="relative">
											<input
												type="datetime-local"
												value={formattedDate}
												className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
												readOnly
											/>
											<Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
										</div>
									</div>
								</div>
							</div>

							{/* Kolom Kanan - QR Code */}
							<div className="h-full flex flex-col">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{/* QR Asesi */}
									<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
										{resultData?.ia01_header?.approved_assessee &&
										assesseeQrValue ? (
											<QRCodeCanvas
												value={assesseeQrValue}
												size={100}
												className="w-40 h-40 object-contain"
											/>
										) : (
											<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
												<span className="text-gray-400 text-sm text-center">
													{resultData?.ia01_header?.approved_assessee
														? "QR Asesi sudah disetujui"
														: "Menunggu persetujuan asesi"}
												</span>
											</div>
										)}
										<span className="text-sm font-semibold text-gray-800">
											{resultData?.assessee?.name || "-"}
										</span>
										{resultData?.ia01_header?.approved_assessee && (
											<span className="text-green-600 text-center font-semibold text-sm mt-2">
												Sudah disetujui asesi
											</span>
										)}
									</div>

									{/* QR Asesor */}
									<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
										{assessorQrValue ? (
											<QRCodeCanvas
												value={assessorQrValue}
												size={100}
												className="w-40 h-40 object-contain"
											/>
										) : (
											<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
												<span className="text-gray-400 text-sm text-center">
													QR Asesor akan muncul di sini
												</span>
											</div>
										)}
										<span className="text-sm font-semibold text-gray-800">
											{resultData?.assessor?.name || "-"}
										</span>
										{resultData?.ia01_header?.approved_assessor === true && (
											<span className="text-green-600 font-semibold text-center text-sm mt-2">
												Sebagai Asesor, Anda sudah setuju
											</span>
										)}
									</div>

									{/* Section bawah tombol (full width, col-span-2) */}
									<div className="col-span-1 sm:col-span-2 mt-8 flex flex-col items-center gap-4">
										{(unitData.length > 0
											? `${Math.round(
													(completedUnits / unitData.length) * 100
											  )}%`
											: "0%") !== "100%" && (
											<span className="text-orange-600 text-sm font-medium text-center">
												Isilah semua unit terlebih dahulu sebelum menyimpan
												hasil rekomendasi.
											</span>
										)}

										{resultData?.ia01_header?.approved_assessee && (
											<span className="text-green-600 text-sm font-medium text-center">
												Asesi telah menyetujui rekomendasi
											</span>
										)}

										{/* Tombol Simpan Rekomendasi */}
										<div className="w-full flex flex-col gap-4">
											<div>
												<div className="text-gray-500 text-xs mb-2 text-center">
													{!recommendation
														? "Pilih rekomendasi terlebih dahulu"
														: assessorQrValue
														? "Setelah generate QR, rekomendasi tidak dapat diubah"
														: "Simpan rekomendasi sebelum generate QR"}
												</div>
												<button
													onClick={handleSaveHeaderClick}
													disabled={
														!canSave &&
														(saveProcessing ||
															!recommendation ||
															assessorQrValue ||
															!isHeaderChanged())
													}
													className={`flex items-center justify-center w-full bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
														!canSave &&
														(saveProcessing ||
															!recommendation ||
															assessorQrValue ||
															!isHeaderChanged())
															? "cursor-not-allowed opacity-50"
															: "hover:bg-green-700 cursor-pointer"
													}`}
												>
													<Save size={18} className="mr-2" />
													{saveProcessing
														? "Menyimpan..."
														: "Simpan Rekomendasi"}
												</button>
												{processError && (
													<div className="text-red-500 text-xs mt-2 text-center">
														{processError}
													</div>
												)}
												{processSuccess && (
													<div className="text-green-500 text-xs mt-2 text-center">
														✅ {processSuccess}
													</div>
												)}
											</div>

											{/* Generate QR */}
											<div>
												<button
													onClick={handleGenerateQRCode}
													disabled={qrProcessing || assessorQrValue || !isSaved}
													className={`flex items-center justify-center w-full bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
														qrProcessing || assessorQrValue || !isSaved
															? "cursor-not-allowed opacity-50"
															: "hover:bg-orange-600 cursor-pointer"
													}`}
												>
													<QrCode size={18} className="mr-2" />
													{qrProcessing
														? "Memproses..."
														: assessorQrValue
														? "QR Sudah Digenerate"
														: "Generate QR"}
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>

			<ConfirmModal
				isOpen={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				onConfirm={handleConfirmSave}
				title="Konfirmasi Simpan"
				message={
					<>
						Anda akan menyimpan pilihan berikut: <br />
						<strong>{pendingValue}</strong>
					</>
				}
				confirmText="Simpan"
				cancelText="Batal"
				type="warning"
			/>
		</div>
	);
}
