import type { APL02Header, Assessee, ResultTemplate } from "@/lib/types";
import type { ElementAPL02 } from "./muk-model";

export interface ResultAPL02 extends ResultTemplate {
	apl02_header: APL02Header;
}

export interface APL02UnitAssessee {
	id: number;
	unit_code: string;
	title: string;
	finished: boolean;
	progress: number;
	total_elements: number;
	completed_elements: number;
}

export interface APL02ResponseElement {
	id: number;
	result_id: number;
	assessee: Assessee;
	approved_assessee: boolean;
	approved_assessor: boolean;
	is_continue: boolean;
	results: {
		id: number;
		element: ElementAPL02;
		is_competent: boolean;
		evidences: { result_apl02_id: number; evidence: string }[];
	}[];
}
