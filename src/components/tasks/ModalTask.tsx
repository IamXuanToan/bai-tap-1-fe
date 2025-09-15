import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    message,
    Modal,
    Progress,
    Row,
    Select,
    Skeleton,
    Space,
    Tag,
    Typography,
} from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import taskApi, { type DataCreate, type DataUpdate } from '../../api/taskApi';
import { useAppSelector } from '../../hooks/hooks';
import './ModalTask.scss';
// import type { ITask } from './interface/TaskInterface';

type ModalAddTask = {
    onOpen: boolean;
    handleCancel: () => void;
    type?: string;
};

type UpdateTaskParams = {
    id: number;
    payload: DataUpdate;
};

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return !!current && current < dayjs().startOf('day');
};

const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
function ModalAddTask({ onOpen, handleCancel }: ModalAddTask) {
    const queryClient = useQueryClient();

    const [messageApi, contextHolder] = message.useMessage(); // 👈 hook nằm trong component

    const [percent, setPercent] = useState<number>(0);

    const [isLoading, setIsLoading] = useState(false);

    const [form] = Form.useForm();

    const type = useAppSelector((state) => state.task.type);

    const idTask = useAppSelector((state) => state.task.id);

    const isDisabled = type === 'view';
    const isEdit = type === 'edit';

    const createTaskMutation = useMutation({
        mutationFn: (payload: DataCreate) => taskApi.create(payload),
        onSuccess: () => {
            // khi tạo thành công refetch lại list
            queryClient.invalidateQueries({ queryKey: ['getAllTask'] });
            messageApi.success('Thêm mới công việc thành công!!');
            // đóng modal
            handleCancel();
        },
        onError: () => {
            messageApi.error('Thêm mới thất bại, thử lại sau!');
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ id, payload }: UpdateTaskParams) => taskApi.update(id, payload),
        onSuccess: () => {
            // khi tạo thành công → refetch lại list
            queryClient.invalidateQueries({ queryKey: ['getAllTask'] });
            messageApi.success('Sửa công việc thành công!!');
            // đóng modal
            handleCancel();
        },
        onError: () => {
            messageApi.error('Sửa thất bại, thử lại sau!');
        },
    });

    const getTask = useQuery({
        queryKey: ['getTask', idTask],
        queryFn: () => taskApi.get(Number(idTask)),
        enabled: !!idTask && (isEdit || isDisabled),
    });

    // console.log(disabled);
    useEffect(() => {
        if (type === 'edit' || type === 'view') {
            if (getTask.data?.data) {
                form.setFieldsValue({
                    nameTask: getTask.data.data.title,
                    descTask: getTask.data.data.description,
                    timeTask: [dayjs(getTask.data.data.start_date), dayjs(getTask.data.data.due_date)],
                    status: getTask.data.data.status,
                    estimatedTime: getTask.data.data.estimated_time,
                    done: getTask.data.data.percent_done,
                });
                setPercent(Number(getTask.data.data.percent_done));
            }
        } else {
            // nếu là Add thì clear luôn
            form.resetFields();
            setPercent(0);
        }
    }, [type, getTask.data, form]);

    const increase = () => {
        setPercent((prevPercent) => {
            const newPercent = prevPercent + 10;
            if (newPercent > 100) {
                return 100;
            }
            return newPercent;
        });
    };

    const decline = () => {
        setPercent((prevPercent) => {
            const newPercent = prevPercent - 10;
            if (newPercent < 0) {
                return 0;
            }
            return newPercent;
        });
    };

    useEffect(() => {
        if (createTaskMutation.isPending || updateTaskMutation.isPending) {
            setIsLoading(true);
            // console.log('done');
        }
    }, [createTaskMutation.isPending, updateTaskMutation.isPending]);

    // const title = ;

    return (
        <>
            {contextHolder}

            <Modal
                title={
                    <Title level={2}>
                        {isDisabled ? 'Xem thông tin công việc' : isEdit ? 'Chỉnh sửa công việc' : 'Thêm mới công việc'}
                    </Title>
                }
                open={onOpen}
                onCancel={() => {
                    handleCancel();
                    // console.log('cancel');
                }}
                // footer={!isDisabled ? null : undefined}
                footer={!isDisabled ? null : (_, { CancelBtn }) => <CancelBtn />}
                // okText="Ok"
            >
                {getTask.isLoading ? (
                    <Skeleton active />
                ) : (
                    <Form
                        name="form"
                        form={form}
                        layout="vertical"
                        style={{ width: '100%', margin: 'auto' }}
                        autoComplete="off"
                        initialValues={{
                            nameTask: '',
                            descTask: '',
                            timeTask: null,
                            estimatedTime: null,
                            done: 0,
                        }}
                        onFinish={(values) => {
                            const [start_date, due_date] = values.timeTask.map((d: dayjs.Dayjs) =>
                                d.format('YYYY-MM-DD'),
                            ); // setData(values);

                            if (!isEdit) {
                                createTaskMutation.mutate(
                                    {
                                        title: values.nameTask,
                                        start_date,
                                        due_date,
                                        status: 'new',
                                        description: values.descTask,
                                        estimated_time: values.estimatedTime,
                                        percent_done: String(percent),
                                    },
                                    {
                                        onSuccess: () => {
                                            setIsLoading(false);
                                        },
                                    },
                                );
                            } else {
                                updateTaskMutation.mutate(
                                    {
                                        id: Number(idTask),
                                        payload: {
                                            title: values.nameTask,
                                            start_date,
                                            due_date,
                                            status: values.status,
                                            description: values.descTask,
                                            estimated_time: values.estimatedTime,
                                            percent_done: String(percent),
                                        },
                                    },
                                    {
                                        onSuccess: () => {
                                            setIsLoading(false);
                                        },
                                    },
                                );
                            }
                        }}
                    >
                        <Form.Item
                            style={{ marginBottom: '6px' }}
                            label={'Nhập tên công việc'}
                            name={'nameTask'}
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên task' },
                                { max: 100, message: 'Vui lòng nhập dưới 100 kí tự' },
                            ]}
                        >
                            <Input
                                count={{
                                    show: true,
                                    max: 100,
                                }}
                                readOnly={isDisabled}
                            />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '6px' }} label={'Nhập mô tả công việc'} name={'descTask'}>
                            <TextArea rows={3} readOnly={isDisabled} />
                        </Form.Item>
                        <Form.Item
                            style={{ marginBottom: '6px' }}
                            label={'Chọn ngày'}
                            name={'timeTask'}
                            rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu và kết thúc' }]}
                        >
                            <RangePicker
                                style={{ width: '100%' }}
                                allowEmpty={[true, true]}
                                disabledDate={disabledDate}
                                placeholder={['Ngày bắt đầu', 'Ngày kết thúc dự kiến']}
                                format={'DD-MM-YYYY'}
                                disabled={isDisabled}
                            />
                        </Form.Item>
                        {isEdit && (
                            <Form.Item
                                style={{ marginBottom: '6px' }}
                                label={'Chọn trạng thái'}
                                name={'status'}
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                            >
                                <Select defaultValue={'new'}>
                                    <Select.Option value="new">
                                        <Tag color="blue">Mới</Tag>
                                    </Select.Option>
                                    <Select.Option value="inProgress">
                                        <Tag color="cyan">Đang làm</Tag>
                                    </Select.Option>
                                    <Select.Option value="completed">
                                        <Tag color="green">Đã hoàn thành</Tag>
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        )}
                        <Row gutter={36}>
                            <Col span={12}>
                                <Form.Item
                                    style={{ marginBottom: '6px' }}
                                    label={'Thời gian dự tính (giờ)'}
                                    name={'estimatedTime'}
                                    rules={[{ required: true, message: 'Vui lòng chọn thời gian dự kiến' }]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: '100%' }}
                                        options={Array.from({ length: 1000 }, (_, i) => ({
                                            value: i + 1,
                                            label: `${i + 1} giờ`,
                                        }))}
                                        disabled={isDisabled}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item style={{ marginBottom: '6px' }} label={'% Hoàn thành'} name={'done'}>
                                    <>
                                        <Flex gap="small">
                                            <Flex vertical gap="small">
                                                <Progress size={40} percent={percent} type="circle" />
                                            </Flex>
                                            <Space.Compact>
                                                <Button
                                                    onClick={decline}
                                                    icon={<MinusOutlined />}
                                                    disabled={isDisabled}
                                                />
                                                <Button
                                                    onClick={increase}
                                                    icon={<PlusOutlined />}
                                                    disabled={isDisabled}
                                                />
                                            </Space.Compact>
                                        </Flex>
                                    </>
                                </Form.Item>
                            </Col>
                            {!isDisabled && (
                                <Col span={24}>
                                    <Form.Item label={null} style={{ textAlign: 'center', marginTop: '10px' }}>
                                        <Space>
                                            {!isEdit && (
                                                <Button
                                                    loading={isLoading}
                                                    onClick={() => {
                                                        form.resetFields();
                                                        setPercent(0);
                                                    }}
                                                >
                                                    Clear
                                                </Button>
                                            )}

                                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                                {isEdit ? 'Cập nhật' : 'Tạo mới'}
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            )}
                        </Row>
                    </Form>
                )}
            </Modal>
        </>
    );
}

export default React.memo(ModalAddTask);
