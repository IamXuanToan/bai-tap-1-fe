export interface ITask {
    id: number;
    title: string;
    status: string;
    start_date: string;
    due_date: string;
    estimated_time: number;
    percent_done: number;
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
