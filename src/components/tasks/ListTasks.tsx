import { Button, Col, message, Row, Skeleton, Table, Tag, Typography } from 'antd';
import ModalAddTask from './ModalTask';
import { useEffect, useRef, useState } from 'react';
import type { PopconfirmProps } from 'antd';
import taskApi from '../../api/taskApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { columns } from './taskColumns';
import { taskSlice } from './taskSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import type { ITask } from '../interface/TaskInterface';

const { Title } = Typography;

type CountStatus = {
    newCount: number;
    inProgressCount: number;
    completedCount: number;
    notCompletedCount: number;
};

// console.log('ListTask');
function ListTask() {
    const queryClient = useQueryClient();

    const [messageApi, contextHolder] = message.useMessage(); // 👈 hook nằm trong component

    const [isOpenModalAddTask, setIsOpenModalAddTask] = useState(false);

    // const [isDisabled, setIsDisabled] = useState(false);

    const [countStatus, setCountStatus] = useState<CountStatus>();

    const disPatch = useAppDispatch();

    const titleRef = useRef<HTMLDivElement | null>(null);

    const idTask = useAppSelector((state) => state.task.id);
    const listAllTask = useAppSelector((state) => state.task.AllTask);

    const deleteTaskMutation = useMutation({
        mutationFn: (id: number) => taskApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getAllTask'] });
            messageApi.success('Xóa thành công!!');
        },
        onError: () => {
            messageApi.error('Xóa thất bại, thử lại sau!');
        },
    });

    const handleConfirm: PopconfirmProps['onConfirm'] = () => {
        deleteTaskMutation.mutate(Number(idTask));
        // messageApi.success('Xóa thành công!! test');
        if (deleteTaskMutation.isSuccess === true) {
            messageApi.success('Xóa thành công!!');
        }
    };

    const handleOpenModel = () => {
        setIsOpenModalAddTask(true);
    };

    const handleCancel = () => {
        setIsOpenModalAddTask(false);
    };

    const state = useAppSelector((state) => state);

    const { data, isLoading, refetch, isSuccess } = useQuery({
        queryKey: ['getAllTask'],
        queryFn: async () => {
            return await taskApi.getAll({
                text: state.filter.text,
                date: state.filter.date,
                status: state.filter.status,
            });
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isSuccess) {
            disPatch(taskSlice.actions.setAllTask(data.data));
        }
    }, [isSuccess, data, disPatch]);

    useEffect(() => {
        refetch();
    }, [state.filter.text, state.filter.date, state.filter.status, refetch]);

    useEffect(() => {
        let newCount: number = 0;
        let inProgressCount: number = 0;
        let completedCount: number = 0;
        // let notCompletedCount: number = 0;
        listAllTask.map((task: ITask) => {
            switch (task.status) {
                case 'new':
                    // console.log('new');
                    newCount += 1;
                    break;
                case 'inProgress':
                    inProgressCount += 1;
                    break;
                case 'completed':
                    completedCount += 1;
                    break;
                default:
                    break;
            }
        });
        const notCompletedCount: number = newCount + inProgressCount;

        setCountStatus({
            newCount,
            inProgressCount,
            completedCount,
            notCompletedCount,
        });
    }, [data]);
    // console.log(countStatus);
    return (
        <>
            {contextHolder}

            <Row>
                <Col span={24}>
                    <Title
                        level={2}
                        style={{ textAlign: 'center', color: 'blue', margin: 0, padding: '10px' }}
                        ref={titleRef}
                    >
                        Danh sách công việc
                    </Title>
                </Col>
                <Col style={{ textAlign: 'center' }} span={24}>
                    <div className="animate-bounce text-red-500">
                        <Title level={5} style={{ color: 'currentColor' }}>
                            {countStatus?.notCompletedCount === 0
                                ? 'Xong hết công việc rồi đó !'
                                : `Yoo - Còn ${countStatus?.notCompletedCount} công việc nữa thôi là xong rồi`}
                        </Title>
                        {/* <Title level={5} style={{ color: 'currentColor' }}>
                                Xong hết công việc rồi đó !
                            </Title> */}
                    </div>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={21} style={{ textAlign: 'left' }}>
                            <div className="ml-6 flex">
                                <Tag color="blue" style={{ padding: '5px 10px' }}>
                                    Mới ({countStatus?.newCount})
                                </Tag>
                                <Tag color="cyan" style={{ padding: '5px 10px' }}>
                                    Đang làm ({countStatus?.inProgressCount})
                                </Tag>
                                <Tag color="red" style={{ padding: '5px 10px' }}>
                                    Chưa hoàn thành ({countStatus?.notCompletedCount})
                                </Tag>
                                <Tag color="green" style={{ padding: '5px 10px' }}>
                                    Đã hoàn thành ({countStatus?.completedCount})
                                </Tag>
                            </div>
                        </Col>
                        <Col span={3}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    handleOpenModel();
                                    disPatch(taskSlice.actions.setType('add'));
                                }}
                            >
                                Add Task
                            </Button>
                        </Col>
                    </Row>
                </Col>

                <Col span={23} style={{ margin: '10px auto' }}>
                    {isLoading ? (
                        <Skeleton active />
                    ) : (
                        <Table
                            rowKey="id"
                            dataSource={data?.data}
                            columns={columns(handleConfirm, handleOpenModel, disPatch)}
                            pagination={{
                                defaultPageSize: 5,
                                position: ['bottomCenter'],
                                showQuickJumper: true,
                                showSizeChanger: true, // cho phép chọn 5/10/20 item mỗi trang
                                pageSizeOptions: ['5', '10', '20', '50', '100'],
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} công việc`,
                                onChange: () => {
                                    titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                },
                            }}
                        />
                    )}

                    {/* <Task /> */}
                </Col>
            </Row>
            <ModalAddTask onOpen={isOpenModalAddTask} handleCancel={handleCancel} />
        </>
    );
}

export default ListTask;
