export type SkemaType = {
	jurusan: string;
	pilihSkema: string;
	pilihOkupasi: string;
	code: string;
	uc_apl02s: UnitAPL02[];
	groups_ia: IA01Group[];
};

export type UnitAPL02 = {
	unit_code: string;
	title: string;
	elements: ElementAPL02[];
};

export type ElementAPL02 = {
	id: string;
	title: string;
	details: ItemElementAPL02[];
};

export type ItemElementAPL02 = {
	id: string;
	description: string;
};

export type IA01Group = {
	name: string;
	scenario: string;
	duration: number;
	units: UnitIA01[];
	tools: {
		name: string;
	}[];
	qa_ia03: [];
};

export type UnitIA01 = {
	unit_code: string;
	title: string;
	elements: ElementIA01[];
};

export type ElementIA01 = {
	id: string;
	title: string;
	details: ItemElementIA01[];
};

export type ItemElementIA01 = {
	id: string;
	description: string;
	benchmark: string;
};

type SkemaTypeRaw = {
	occupation_id: number;
	code: string;
	uc_apl02s: {
		unit_code: string;
		title: string;
		elements: {
			title: string;
			details: {
				description: string;
			}[];
		}[];
	}[];
	groups_ia: {
		name: string;
		scenario: string;
		duration: number;
		units: {
			unit_code: string;
			title: string;
			elements: {
				title: string;
				details: {
					description: string;
					benchmark: string;
				}[];
			}[];
		}[];
		tools: {
			name: string;
		}[];
		qa_ia03: {
			question: string;
		}[];
	}[];
	// ia05_questions: {
	// 	order: number;
	// 	question: string;
	// 	options: {
	// 		option: string;
	// 		is_answer: boolean;
	// 	}[];
	// }[];
	// ia07_questions: {
	// 	question: string;
	// 	answer_key: string;
	// }[];
};

export function convertSkemaToPostPayload(
	skema: SkemaType,
	occupation_id: number
): SkemaTypeRaw {
	return {
		occupation_id,
		code: skema.code,
		uc_apl02s: skema.uc_apl02s.map((unit) => ({
			unit_code: unit.unit_code,
			title: unit.title,
			elements: unit.elements.map((elemen) => ({
				title: elemen.title,
				details: elemen.details.map((item) => ({
					description: item.description,
				})),
			})),
		})),
		groups_ia: skema.groups_ia.map((group) => ({
			name: group.name,
			scenario: group.scenario,
			duration: group.duration,
			units: group.units.map((unit) => ({
				unit_code: unit.unit_code,
				title: unit.title,
				elements: unit.elements.map((elemen) => ({
					title: elemen.title,
					details: elemen.details.map((item) => ({
						description: item.description,
						benchmark: item.benchmark,
					})),
				})),
			})),
			tools: group.tools.map((tool) => ({
				name: "tool.name",
			})),
			qa_ia03: group.qa_ia03.map((question) => ({
				question: "question.question",
			})),
		})),
		// ia05_questions: skema.groups_ia
		// 	.flatMap((group) => group.qa_ia03)
		// 	.map((question, index) => ({
		// 		order: index + 1,
		// 		question: question.question,
		// 		options: [{ option: "A", is_answer: true }, { option: "B", is_answer: false }],
		// 	})),
		// ia07_questions: skema.groups_ia.flatMap((group) =>
		// 	group.qa_ia03.map((question) => ({
		// 		question: question.question,
		// 		answer_key: "",
		// 	}))
		// ),
	};
}
