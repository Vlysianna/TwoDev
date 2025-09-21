import type { APL02Header, ResultTemplate } from "@/lib/types";
import type { ItemElementAPL02 } from "./muk-model";

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
	uc_id: number;
	title: string;
	details: ItemElementAPL02[];
	result: {
		id: number;
		header_id: number;
		element_id: number;
		is_competent: boolean;
		evidences: { id: number; evidence: string }[];
	};
}
