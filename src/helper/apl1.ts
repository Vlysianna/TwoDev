import api from '@/helper/axios';

export interface CreateAssesseeAPL1Payload {
  user_id: number;
  full_name: string;
  identity_number: string;
  birth_date: string; // ISO
  birth_location: string;
  gender: string; // male/female or Laki-laki/Perempuan
  nationality: string;
  phone_no: string;
  house_phone_no?: string;
  office_phone_no?: string;
  address: string;
  postal_code: string;
  educational_qualifications: string;
  job?: Array<{
    institution_name: string;
    address: string;
    postal_code: string;
    position: string;
    phone_no: string;
    job_email: string;
  }>;
}

export async function createOrUpdateAssesseeAPL1(data: CreateAssesseeAPL1Payload) {
  const res = await api.post('/assessments/apl-01/create-self-data', data);
  return res.data;
}

export interface UploadCertificatePayload {
  assessment_id: number;
  assessee_id: number;
  assessor_id: number;
  purpose?: string;
  school_report_card?: File | null;
  field_work_practice_certificate?: File | null;
  student_card?: File | null;
  family_card?: File | null;
  id_card?: File | null;
}

export async function uploadCertificateDocs(payload: UploadCertificatePayload) {
  const form = new FormData();
  form.append('assessment_id', String(payload.assessment_id));
  form.append('assessee_id', String(payload.assessee_id));
  form.append('assessor_id', String(payload.assessor_id));
  if (payload.purpose) form.append('purpose', payload.purpose);
  const fileFields: Array<keyof UploadCertificatePayload> = [
    'school_report_card',
    'field_work_practice_certificate',
    'student_card',
    'family_card',
    'id_card'
  ];
  fileFields.forEach(f => {
    const file = payload[f];
    if (file instanceof File) {
      form.append(f, file);
    }
  });
  const res = await api.post('/assessments/apl-01/create-certificate-docs', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function getAPL1Results() {
  const res = await api.get('/assessments/apl-01/results');
  return res.data;
}

export async function approveAPL1Result(resultId: number) {
  const res = await api.put(`/assessments/apl-01/results/${resultId}/approve`);
  return res.data;
}
