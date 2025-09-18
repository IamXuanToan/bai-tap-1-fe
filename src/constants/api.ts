export const API_ENDPOINTS = {
    TASK: {
        GET_ALL: `task`,
        GET: (id: number | string) => `task/${id}`,
        CREATE: `task`,
        UPDATE: (id: number | string) => `task/${id}`,
        DELETE: (id: number | string) => `task/${id}`,
    }
}