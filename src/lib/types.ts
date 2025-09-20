export interface Assessment {
	id: number;
	code: string;
	occupation: Occupation;
	occupation_id: number;
}

export type Occupation = {
	id: number;
	scheme_id: number;
	name: string;
	created_at: string;
	updated_at: string;
	scheme: Scheme;
};

export type Scheme = {
	id: number;
	code: string;
	name: string;
	created_at: string;
	updated_at: string;
};

export interface Assessee {
	id: number;
	name: string;
	email: string;
}

export interface Assessor {
	id: number;
	name: string;
	email: string;
	no_reg_met: string;
}

export interface APL02Header {
	id: number;
	result_id: number;
	approved_assessee: boolean;
	approved_assessor: boolean;
	is_continue: boolean;
}

export interface ResultTemplate {
	id: number;
	assessment: Assessment;
	assessee: Assessee;
	assessor: Assessor;
	tuk: string;
	is_competent: boolean;
	created_at: string;
}
