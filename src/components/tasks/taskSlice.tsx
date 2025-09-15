import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
    type: 'view' | 'add' | 'edit';
    id?: string;
};

const initialState: InitialState = {
    type: 'add',
    id: undefined,
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
    },
});
