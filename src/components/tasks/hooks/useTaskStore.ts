import { useDispatch } from 'react-redux';
import { taskSlice } from '../taskSlice';
import type { ITask } from '../../interface/TaskInterface';

export default function useTaskStore() {
    const disPatch = useDispatch();

    const setId = (id: number | string) => disPatch(taskSlice.actions.setId(id));

    const setType = (type: 'view' | 'add' | 'edit') => disPatch(taskSlice.actions.setType(type));

    const setAllTask = (AllTask: ITask[]) => disPatch(taskSlice.actions.setAllTask(AllTask));
    
    const addTask = (task: ITask) => disPatch(taskSlice.actions.addTask(task));

    return { setId, setType, setAllTask, addTask };
}
