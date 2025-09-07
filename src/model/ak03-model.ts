export interface AK03Question {
  id: number;
  question: string;
  answer: boolean | null;
  comment: string;
}

export interface AK03Data {
  id: number;
  result_id: number;
  comment: string;
  rows: AK03Question[];
}

export interface AssessmentData {
  id: number;
  assessment: {
    id: number;
    code: string;
    occupation: {
      id: number;
      name: string;
      scheme: {
        id: number;
        name: string;
        code: string;
      };
    } | null;
  } | null;
  schedule: {
    id: number;
    assessment_id: number;
    start_date: string;
    end_date: string;
  } | null;
  assessee: {
    id: number;
    name: string;
    email: string;
  } | null;
  assessor: {
    id: number;
    name: string;
    email: string;
    no_reg_met: string;
  } | null;
  tuk: string;
  is_competent: boolean;
  created_at: string;
  result_ak03: AK03Data;
}
