import type { ResultTemplate } from "@/lib/types";

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

export interface ResultIA02 extends ResultTemplate {
    ia02_header: IA02Header;
}

interface IA02Header {
    id: number;
    approved_assessee: boolean;
    approved_assessor: boolean;
    created_at: string;
    updated_at: string;
}