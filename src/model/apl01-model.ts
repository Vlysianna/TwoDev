export interface ResultAPL01 {
	id: number;
	user_id: number;
	identity_number: string;
	birth_date: string;
	birth_location: string;
	gender: string;
	nationality: string;
	phone_no: string;
	house_phone_no: string;
	office_phone_no: string;
	address: string;
	postal_code: string;
	educational_qualifications: string;
	created_at: string;
	updated_at: string;
	full_name: string;
	job: JobAssessee;
}

interface JobAssessee {
	id: number;
	assessee_id: number;
	institution_name: string;
	address: string;
	postal_code: string;
	position: string;
	phone_no: string;
	job_email: string;
	created_at: string;
	updated_at: string;
}

export interface ResultDocs {
	purpose: string;
	school_report_card: File | null;
	field_work_practice_certificate: File | null;
	student_card: File | null;
	family_card: File | null;
	id_card: File | null;
}