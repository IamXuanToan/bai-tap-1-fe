import { useMutation } from '@tanstack/react-query';
import type { DataCreate } from '../../../api/taskApi';
import taskApi from '../../../api/taskApi';
import useTaskStore from './useTaskStore';
// import { message } from 'antd';

export default function useCreateTaskMutation() {
    // const queryClient = useQueryClient();

    const taskStore = useTaskStore();

    return useMutation({
        mutationFn: (payload: DataCreate) => taskApi.create(payload),
        onMutate: async (newTask) => {
            // update ngay vào redux
            console.log(newTask);
            taskStore.addTask({
                ...newTask,
                id: Date.now(), // tạo id tạm
                created_at: '13123',
                updated_at: ' 23234',
            });
        },
        // onSuccess: () => {
        //     queryClient.invalidateQueries({ queryKey: ['getAllTask'] });
        // },
    });
}
