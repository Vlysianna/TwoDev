export interface ResultAK05Detail {
  id: number;
  result_id: number;
  approved_assessor: boolean;
  is_competent: boolean;
  description: string;
  negative_positive_aspects: string;
  rejection_notes: string | null;
  improvement_suggestions: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Result {
  id: number;
  assessment: Assessment;
  assessee: Assessee;
  assessor: Assessor;
  tuk: string;
  created_at: string;
  result_ak05: ResultAK05Detail;
  updated_at: string;
}

export interface AK05ResponseData {
  id: number;
  result: Result;
  is_competent: boolean;
}

export interface AK05ApiResponse {
  success: boolean;
  data: AK05ResponseData;
}

export interface Scheme {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Occupation {
  id: number;
  scheme_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  scheme: Scheme;
}

export interface Assessment {
  id: number;
  occupation_id: number;
  code: string;
  created_at: string;
  updated_at: string;
  occupation: Occupation;
}

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
