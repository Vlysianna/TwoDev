export interface ResultIA05C {
    id: number;
    assessment: Assessment;
    assessee: Assessee;
    assessor: Assessor;
    tuk: string;
    is_competent: boolean;    
    created_at: string;
    ia05_header: IA05Header;
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

interface IA05Header {
    id: number;
    approved_assessee: boolean;
    approved_assessor: boolean;
    is_achieved: boolean;
    unit: string;
    element: string;
    kuk: string;
    created_at: string;
    updated_at: string;
}

export interface AssesseeAnswer {
    id: number;
    order: number;
    question: string;
    answers: {
        id: number;
        option: string;
        approved: boolean;
    }
}