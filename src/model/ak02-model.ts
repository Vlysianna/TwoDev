import type { ResultTemplate } from "@/lib/types";

export interface ResultAK02 extends ResultTemplate {
    ak02_headers: AK02Header;
}

interface AK02Header {
    id: number;
    approved_assessee: boolean;
    approved_assessor: boolean;
    is_competent: boolean | null;
    follow_up: string;
    comment: string;
    rows: AK02Row[];
}

interface AK02Row {
    id: number;
    unit_id: number;
    unit_title: string;
    unit_code: string;
    evidences: Evidence[];
}

interface Evidence {
    id: number;
    evidence: string;
}

export interface UnitCompetensi {
    id: number;
    code: string;
    title: string;
}

export interface AK02Data {
    id?: number;
    result_id: number;
    approved_assessee: boolean;
    approved_assessor: boolean;
    is_competent: boolean | null;
    follow_up: string;
    comment: string;
    rows: AK02Row[];
}