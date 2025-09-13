import { Col, DatePicker, Form, Input, Row, Select, Tag, Typography } from 'antd';
import type { GetProps, SelectProps } from 'antd';

import dayjs from 'dayjs';
import { useState } from 'react';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
type DateString = [string?, string?];
type TagRender = SelectProps['tagRender'];

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return !!current && current < dayjs().startOf('day');
};

const options: SelectProps['options'] = [
    { value: 'blue', label: 'Mới' },
    { value: 'cyan', label: 'Đang Làm' },
    { value: 'red', label: 'Đã Hoàn Thành' },
    { value: 'green', label: 'Chưa Hoàn Thành' },
];

// const value: ValueSelector = ['1', '2', '3'];

const tagRender: TagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            color={value}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginInlineEnd: 4 }}
        >
            {label}
        </Tag>
    );
};

const { Title } = Typography;

const { RangePicker } = DatePicker;

function Filters() {
    const [dateStrings, setdateStrings] = useState<DateString | null>(null);

    // const [selectedDates, setSelectedDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);

    // const [date, setDate] = useState(true);

    const handleDateChange = (dateString: DateString) => {
        setdateStrings(dateString);
        if (dateString[0] === '') {
            return setdateStrings([]);
        }
    };

    return (
        <>
            <Row>
                <Col span={24}>
                    <Title level={2} style={{ textAlign: 'center', color: 'blue', margin: 0, padding: '10px' }}>
                        Tìm kiếm
                    </Title>
                </Col>
                <Col span={24}>
                    <Form layout="vertical" style={{ width: '90%', margin: 'auto' }} autoComplete="off">
                        <Form.Item
                            style={{ marginBottom: '6px' }}
                            label={'Nhập tên task'}
                            name={'filterSearch'}
                            rules={[{ max: 200, message: 'Vui lòng nhập dưới 200 kí tự' }]}
                        >
                            <Input
                                count={{
                                    show: true,
                                    max: 200,
                                }}
                            />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '6px' }} label={'Chọn ngày'} name={'filterDate'}>
                            <div>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    // value={selectedDates}
                                    disabledDate={disabledDate}
                                    format={'DD-MM-YYYY'}
                                    allowEmpty={true}
                                    onChange={(dates, dateStrings) => {
                                        if (!dates || !dates[0]) {
                                            // reset state khi không chọn ngày
                                            handleDateChange(['']);
                                        } else {
                                            handleDateChange(dateStrings);
                                        }
                                    }}
                                />
                                <div className="animate-pulse mt-2 text-center" style={{ whiteSpace: 'pre-line' }}>
                                    {dateStrings?.length === 0 || dateStrings === null || dateStrings?.[0] === ''
                                        ? `Đăng hiển thị công việc\ntrong ngày hôm nay ${dayjs().format('DD-MM-YYYY')}!`
                                        : `Đang hiển thị công việc\ntừ ${dateStrings[0]} đến ${dateStrings[1]}!`}
                                </div>
                            </div>
                        </Form.Item>
                        <Form.Item
                            style={{ marginBottom: '15px' }}
                            label={'Tìm kiếm theo trạng thái'}
                            name={'filterStatus'}
                        >
                            <Select
                                mode="multiple"
                                tagRender={tagRender}
                                optionFilterProp="label"
                                style={{ width: '100%' }}
                                options={options}
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

export default Filters;
