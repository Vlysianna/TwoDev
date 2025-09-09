
export interface ScheduleCompletedDetail {
    id: number;
    assessment: {
        id: number;
        code: string;
        occupation: {
            id: number;
            name: string;
            scheme: {
                id: number;
                code: string;
                name: string;
            };
        };
    };
    start_date: string;
    end_date: string;
    schedule_details: {
        id: number;
        assessor: {
            id: number;
            full_name: string;
            phone_no: string;
        };
        location: string;
    };
}

export interface ScheduleCompleted {
    status: "Competent" | "Not Competent";
    detail: ScheduleCompletedDetail;
}