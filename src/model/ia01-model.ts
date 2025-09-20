import type { ResultTemplate } from "@/lib/types";

export interface ResultIA01 extends ResultTemplate {
	ia01_header: IA01Header;
}

export interface IA01Header extends ResultTemplate {
  id: number;
  result_id: number;
  approved_assessee: boolean;
  approved_assessor: boolean;
  is_competent: boolean;
  group: string;
  unit: string;
  element: string;
  kuk: string;
  created_at: string;
  updated_at: string;
}

export interface IA01Group {
  id: number;
  assessment_id: number;
  name: string;
  units: UnitIA01[];
};

interface UnitIA01 {
  id: number,
  title: string;
  finished: boolean;
  progress: number;
}