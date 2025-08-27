export type SkemaType = {
	jurusan: string;
	pilihSkema: string;
	pilihOkupasi: string;
	code: string;
	uc_apl02s: UnitAPL02[];
	groups_ia: {
		name: string;
		scenario: string;
		duration: number;
		units: UnitIA01[];
		tools: [];
		qa_ia03: [];
	};
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
	unit_competencies: {
		unit_code: string;
		title: string;
		elements: {
			title: string;
			element_details: {
				description: string;
			}[];
		}[];
	}[];
};

export function convertSkemaToPostPayload(
	skema: SkemaType,
	occupation_id: number
): SkemaTypeRaw {
	return {
		occupation_id,
		code: skema.code,
		unit_competencies: skema.uc_apl02s.map((unit) => ({
			unit_code: unit.unit_code,
			title: unit.title,
			elements: unit.elements.map((elemen) => ({
				title: elemen.title,
				element_details: elemen.details.map((item) => ({
					description: item.description,
				})),
			})),
		})),
	};
}
