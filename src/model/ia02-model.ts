export interface GroupIA {
    id: number;
    name: string;
    scenario: string;
    duration: number;
    units: UnitIA[];
    tools: Tool[];
}

interface UnitIA {
    id: number;
    unit_code: string;
    title: string;
}

interface Tool {
    id: number;
    name: string;
}

export interface ResultIA02 {
    id: number;
    assessment: Assessment;
    assessee: Assessee;
    assessor: Assessor;
    tuk: string;
    is_competent: boolean;    
    created_at: string;
    ia02_header: IA02Header;
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

interface IA02Header {
    id: number;
    approved_assessee: boolean;
    approved_assessor: boolean;
    created_at: string;
    updated_at: string;
}