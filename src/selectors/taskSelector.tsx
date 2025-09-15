import { useQuery } from '@tanstack/react-query';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../stores/store';
import taskApi from '../api/taskApi';

export const filterText = (state: RootState) => state.filter.text;
export const filterDate = (state: RootState) => state.filter.date;
export const filterStatus = (state: RootState) => state.filter.text;

export const taskList = createSelector(filterText, filterDate, filterStatus, (text, date, status) => {
    const filter = {
        text,
        date,
        status,
    };
    const { data } = useQuery({
        queryKey: ['getAllTask', filter],
        queryFn: () => {
            return taskApi.getAll({
                text: text,
                date: date,
                status: status,
            });
        },
    });
});
