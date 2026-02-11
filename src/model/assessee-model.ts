export interface AssesseeJob {
	id?: number;
	assessee_id?: number;
	institution_name: string;
	address: string;
	postal_code: string;
	position: string;
	phone_no: string;
	job_email: string;
	created_at?: string;
	updated_at?: string;
}

export interface AssesseeRequest {
	id?: number;
	user_id: number;
	full_name: string;
	identity_number: string;
	birth_date: Date;
	birth_location: string;
	gender: string;
	nationality: string;
	phone_no: string;
	house_phone_no?: string;
	office_phone_no?: string;
	address: string;
	postal_code: string;
	educational_qualifications: string;
	jobs?: AssesseeJob[];
	created_at?: string;
	updated_at?: string;
	signature: FileList | string;
}

export interface Assessee {
	id?: number;
	user_id: number;
	full_name: string;
	identity_number: string;
	birth_date: Date;
	birth_location: string;
	gender: string;
	nationality: string;
	phone_no: string;
	house_phone_no?: string;
	office_phone_no?: string;
	address: string;
	postal_code: string;
	educational_qualifications: string;
	job?: AssesseeJob;
	created_at?: string;
	updated_at?: string;
}
