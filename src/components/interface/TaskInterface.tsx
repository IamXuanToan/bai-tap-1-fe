export interface ITask {
    id?: number;
    title: string;
    start_date: string;
    due_date: string;
    status: string;
    description: string;
    estimated_time: string;
    percent_done: string;
    created_at: string;
    updated_at: string;
}

export interface ITaskRow {
    id: number;
    name: string;
    status: React.ReactNode;
    startDate: string;
    dueDate: string;
    estimatedTime: string | number;
    done: React.ReactNode;
}
