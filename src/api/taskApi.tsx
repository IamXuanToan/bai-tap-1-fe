import { API_ENDPOINTS } from '../constants/api';
import axiosClient from './axiosClient';

export type DataCreate = {
    id?: number | string;
    title: string;
    start_date: string;
    due_date: string;
    status: string;
    description: string;
    estimated_time: string;
    percent_done: string;
    created_at?: string;
    updated_at?: string;
};

//     id?: number;
//     title: string;
//     start_date: string;
//     due_date: string;
//     status: string;
//     description: string;
//     estimated_time: string;
//     percent_done: string;
//     created_at: string;
//     updated_at: string;
// }

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
        axiosClient.get(API_ENDPOINTS.TASK.GET_ALL, {
            params: {
                text: dataFilters.text,
                date: dataFilters.date,
                status: dataFilters.status,
            },
        }),
    get: (id: number) => axiosClient.get(API_ENDPOINTS.TASK.GET(id)),
    create: (data: DataCreate) => axiosClient.post(API_ENDPOINTS.TASK.CREATE, data),
    update: (id: number, data: DataUpdate) => axiosClient.patch(API_ENDPOINTS.TASK.UPDATE(id), data),
    delete: (id: number) => axiosClient.delete(API_ENDPOINTS.TASK.DELETE(id)),
};

export default taskApi;
// const taskApi = {
//     getAll: (dataFilters: DataFilters) =>
//         axiosClient.get(`task`, {
//             params: {
//                 text: dataFilters.text,
//                 date: dataFilters.date,
//                 status: dataFilters.status,
//             },
//         }),
//     get: (id: number) => axiosClient.get(`task/${id}`),
//     create: (data: DataCreate) => axiosClient.post(`task`, data),
//     update: (id: number, data: DataUpdate) => axiosClient.patch(`task/${id}`, data),
//     delete: (id: number) => axiosClient.delete(`task/${id}`),
// };
