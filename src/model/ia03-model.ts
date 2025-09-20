// ========================
// Group IA03 (Get Units + Questions)

import type { Assessee, ResultTemplate } from "@/lib/types";

// ========================
export interface GroupIA03 {
  id: number;
  assessment_id: number;
  name: string;
  units: UnitIA03[];
  questions: QuestionIA03[];
}

export interface UnitIA03 {
  id: number;
  group_id: number;
  unit_code: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionIA03 {
  id: number;
  question: string;
  result?: QuestionResultIA03; // hasil jawaban asesi
}

export interface QuestionResultIA03 {
  id: number;
  header_id: number;
  answer: string;
  approved: boolean;
}

// ========================
// Result IA03 (Get Result)
// ========================
export interface ResultIA03 extends ResultTemplate {
  ia03_header: IA03Header;
}

export interface IA03Header {
  id: number;
  result_id: number;
  approved_assessee: boolean;
  approved_assessor: boolean;
  created_at: string;
  updated_at: string;
}

// ========================
// Send Result IA03 (jawaban pertanyaan)
// ========================
export interface SendResultIA03 {
  id: number;
  header_id: number;
  question_id: number;
  answer: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

// ========================
// Approve IA03 (asesi/asesor approve hasil)
// ========================
export interface ApproveIA03 {
  id: number;
  result_id: number;
  assessee?: Assessee; // opsional tergantung role
  approved_assessee: boolean;
  approved_assessor: boolean;
}
