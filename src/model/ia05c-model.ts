import type { ResultTemplate } from "@/lib/types";

export interface ResultIA05 extends ResultTemplate {
	ia05_header: IA05Header;
}

interface IA05Header {
	id: number;
	approved_assessee: boolean;
	approved_assessor: boolean;
	is_achieved: boolean;
	unit: string;
	element: string;
	kuk: string;
	created_at: string;
	updated_at: string;
}

export interface AssesseeAnswer {
	id: number;
	order: number;
	question: string;
	answers: {
		id: number;
		option: string;
		approved: boolean;
	};
}

export interface IA05Question {
	order: number;
	question: string;
	options: {
		option: string;
		is_answer: boolean;
	}[];
};
