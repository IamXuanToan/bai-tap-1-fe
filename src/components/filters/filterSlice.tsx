import { createSlice } from '@reduxjs/toolkit';

export type FilterType = {
    text?: string;
    date?: [string, string] | [];
    status?: string[];
};

const initialState: FilterType = {
    text: '',
    date: [],
    status: [],
};

export const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setText: (state, action) => {
            state.text = action.payload;
        },

        setDate: (state, action) => {
            state.date = action.payload;
        },

        setStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});
