import { useMutation } from '@tanstack/react-query';
import taskApi, { type DataUpdate } from '../../../api/taskApi';
// import { message } from 'antd';

type UpdateTaskParams = {
    id: number;
    payload: DataUpdate;
};

export default function useUpdateTaskMutation() {

    return useMutation({
        mutationFn: ({ id, payload }: UpdateTaskParams) => {
            return taskApi.update(id, payload)
        },
        // onSuccess: () => {
        //     queryClient.invalidateQueries({ queryKey: ['getAllTask'] });
        // },
    });
}
