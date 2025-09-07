export interface ResultAK02 {
    id: number;
    assessment: Assessment;
    assessee: Assessee;
    assessor: Assessor;
    tuk: string;
    is_competent: boolean;
    created_at: string;
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

interface Assessment {
    id: number;
    code: string;
    occupation: Occupation;
}

interface Occupation {
    id: number;
    name: string;
    scheme: Scheme;
}

interface Scheme {
    id: number;
    code: string;
    name: string;
}

interface Assessee {
    id: number;
    name: string;
    email: string;
}

interface Assessor {
    id: number;
    name: string;
    email: string;
    no_reg_met: string;
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