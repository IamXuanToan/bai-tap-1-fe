import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Progress, Space, Tag, Tooltip, type PopconfirmProps } from 'antd';
import type { ITask } from './interface/TaskInterface';
import type { ColumnsType } from 'antd/lib/table';
import { useDispatch } from 'react-redux';
import { taskSlice } from './taskSlice';

// console.log('columns');

export const columns = (
    handleConfirm: Exclude<PopconfirmProps['onConfirm'], undefined>,
    handleOpenModel: () => void,
    disPatch: ReturnType<typeof useDispatch>,
): ColumnsType<ITask> => {
    return [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên task',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                switch (status) {
                    case 'new':
                        return (
                            <div className="text-center">
                                <Tag color="blue">Mới</Tag>
                            </div>
                        );
                    case 'inProgress':
                        return (
                            <div className="text-center">
                                <Tag color="cyan">Đang làm</Tag>
                            </div>
                        );
                    case 'completed':
                        return (
                            <div className="text-center">
                                <Tag color="green">Đã hoàn thành</Tag>
                            </div>
                        );
                    case 'notCompleted':
                        return (
                            <div className="text-center">
                                <Tag color="red">Chưa hoàn thành</Tag>
                            </div>
                        );
                    default:
                        return (
                            <div className="text-center">
                                <Tag>{status}</Tag>
                            </div>
                        );
                }
            },
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'start_date',
            key: 'start_date',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'due_date',
            key: 'due_date',
        },
        {
            title: 'Thời gian dự kiến (giờ)',
            dataIndex: 'estimated_time',
            key: 'estimated_time',
        },
        {
            title: '% Hoàn thành',
            dataIndex: 'percent_done',
            key: 'percent_done',
            render: (percent_done: string) => {
                return <Progress type="circle" percent={Number(percent_done)} size={35} />;
            },
        },
        {
            title: 'Chức năng',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                handleOpenModel();

                                disPatch(taskSlice.actions.setType('view'));
                                disPatch(taskSlice.actions.setId(record.id));
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button
                            color="gold"
                            variant="solid"
                            icon={<EditOutlined />}
                            onClick={() => {
                                handleOpenModel();
                                disPatch(taskSlice.actions.setType('edit'));
                                disPatch(taskSlice.actions.setId(record.id));
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Zooooo!"
                        description="Bạn chắc chắn muốn xóa công việc này chứ?"
                        okText="Xóa luôn!"
                        cancelText="Đợi đã nào"
                        onConfirm={() => {
                            disPatch(taskSlice.actions.setId(record.id));
                            handleConfirm();
                        }}
                    >
                        <Button color="danger" variant="solid" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];
};
