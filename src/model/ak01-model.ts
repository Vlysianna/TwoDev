import type { ResultTemplate } from "@/lib/types";

export interface ResultAK01 extends ResultTemplate {
    locations: string[]
    ak01_header: AK01Header;
}

interface AK01Header {
    id: number;
    approved_assessee: boolean;
    approved_assessor: boolean;
    rows: AK01Row[];
    created_at: string;
    updated_at: string;
}

interface AK01Row {
    id: number;
    header_id: number;
    evidence: string;
}