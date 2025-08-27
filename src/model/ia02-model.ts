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