import { configureStore } from '@reduxjs/toolkit';
import { taskSlice } from '../components/tasks/taskSlice';
import { filterSlice } from '../components/filters/filterSlice';

export const store = configureStore({
    reducer: {
        task: taskSlice.reducer,
        filter: filterSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
