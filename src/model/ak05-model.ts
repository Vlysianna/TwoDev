import type { ResultTemplate } from "@/lib/types";

export interface AK05Header {
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

export interface ResultAK05 extends ResultTemplate {
  result_ak05: AK05Header;
  updated_at: string;
}

export interface AK05ResponseData {
  id: number;
  result: ResultAK05;
  is_competent: boolean;
}

export interface AK05ApiResponse {
  success: boolean;
  data: AK05ResponseData;
}