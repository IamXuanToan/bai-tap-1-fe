import axiosClient from './axiosClient';

export type DataCreate = {
    title: string;
    start_date: string;
    due_date: string;
    status: string;
    description: string;
    estimated_time: string;
    percent_done: string;
};

export type DataUpdate = {
    title?: string;
    start_date?: string;
    due_date?: string;
    status?: string;
    description?: string;
    estimated_time?: string;
    percent_done?: string;
};

export type DataFilters = {
    text?: string;
    date?: [string, string] | [];
    status?: string[];
};

const taskApi = {
    getAll: (dataFilters: DataFilters) =>
        axiosClient.get(`task`, {
            params: {
                text: dataFilters.text,
                date: dataFilters.date,
                status: dataFilters.status,
            },
        }),
    get: (id: number) => axiosClient.get(`task/${id}`),
    create: (data: DataCreate) => axiosClient.post(`task`, data),
    update: (id: number, data: DataUpdate) => axiosClient.patch(`task/${id}`, data),
    delete: (id: number) => axiosClient.delete(`task/${id}`),
};

export default taskApi;
