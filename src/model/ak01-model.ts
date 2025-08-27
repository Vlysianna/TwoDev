export interface ResultAK01 {
    id: number;
    assessment: Assessment;
    assessee: Assessee;
    assessor: Assessor;
    tuk: string;
    is_competent: boolean;    
    created_at: string;
    locations: string[]
    ak01_header: AK01Header;
}

interface AK01Header {
    id: number;
    approved_assessee: boolean;
    approved_assessor: boolean;
    created_at: string;
    updated_at: string;
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