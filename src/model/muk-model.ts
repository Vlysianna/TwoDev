import type { Occupation, Scheme } from "@/lib/types";


export type MukTypeInput = {
	scheme_id: number;
	occupation_name: string;
	code: string;
	uc_apl02s: UnitAPL02[];
	groups_ia01: IA01Group[];
	groups_ia02: IA02Group[];
	groups_ia03: IA03Group[];
	ia05_questions?: IA05Question[] | null;
	ia07_questions?: IA07Question[] | null;
};

export type MukType = {
	id: number;
	code: string;
	name: string;
	created_at: string;
	updated_at: string;
	occupation: {
		id: number;
		scheme_id: number;
		name: string;
		created_at: string;
		updated_at: string;
		scheme: Scheme;
	};
};

export type MukDetailType = {
	id: number;
	occupation: Occupation;
	code: string;
	uc_apl02s: UnitAPL02[];
	groups_ia01: IA01Group[];
	groups_ia02: IA02Group[];
	groups_ia03: IA03Group[];
	ia05_questions?: IA05Question[] | null;
	ia07_questions?: IA07Question[] | null;
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
	units: UnitIA01[];
};

export type IA02Group = {
	name: string;
	scenario: string;
	duration: number;
	units: UnitIA02[];
	tools: {
		name: string;
	}[];
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

export type UnitIA02 = {
	unit_code: string;
	title: string;
};

export type IA03Group = {
	name: string;
	units: UnitIA03[];
	qa_ia03: IA03Question[];
};

export type UnitIA03 = {
	unit_code: string;
	title: string;
};

export type IA03Question = {
	question: string;
};

export type IA05Question = {
	order: number;
	question: string;
	options: {
		option: string;
		is_answer: boolean;
	}[];
};

export type IA07Question = {
	question: string;
	answer_key: string;
};