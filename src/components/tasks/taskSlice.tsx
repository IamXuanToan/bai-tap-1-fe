import { createSlice } from '@reduxjs/toolkit';
import type { ITask } from '../interface/TaskInterface';

type InitialState = {
    type: 'view' | 'add' | 'edit';
    id?: string;
    AllTask: ITask[];
};

const initialState: InitialState = {
    type: 'add',
    id: undefined,
    AllTask: []
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setType: (state, action) => {
            state.type = action.payload;
        },

        setId: (state, action) => {
            state.id = action.payload;
        },

        setAllTask: (state, action) => {
            state.AllTask = action.payload;
        },

        addTask: (state, action) => {
            state.AllTask.push(action.payload);
        },
    },
});
