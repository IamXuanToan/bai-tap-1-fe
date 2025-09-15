import { Col, DatePicker, Form, Input, Row, Select, Tag, Typography } from 'antd';
import type { SelectProps } from 'antd';

import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/hooks';
import { filterSlice } from './filterSlice';
import { useDebounce } from '../../hooks/useDebounce';

type DateString = [string?, string?] | [];

type DateDayjs = [Dayjs | null, Dayjs | null] | null;

type TagRender = SelectProps['tagRender'];

type Status = string[];

const options: SelectProps['options'] = [
    { color: 'blue', value: 'new', label: 'Mới' },
    { color: 'cyan', value: 'inProgress', label: 'Đang làm' },
    { color: 'green', value: 'completed', label: 'Đã hoàn thành' },
];

const tagRender: TagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const option = options.find((o) => o.value === value);

    return (
        <Tag
            color={option?.color}
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
    const [dateStrings, setdateStrings] = useState<DateString>([]);

    const [textSearch, setTextSearch] = useState('');
    const [dateSearch, setDateSearch] = useState<DateDayjs | null>(null);

    const [statusSearch, setStatusSearch] = useState<Status>([]);
    const disPatch = useAppDispatch();

    const debouncedText = useDebounce(textSearch, 500);

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTextSearch(e.target.value);
    };

    //dùng debounced để khi nhập ví dụ muốn tìm 'xuân' thì khi nhập vào text thì sau 500ms mới thêm text và redux
    useEffect(() => {
        disPatch(filterSlice.actions.setText(debouncedText));
    }, [debouncedText, disPatch]);

    const handleChangeDate = (dates: DateDayjs, dateStrings: DateString) => {
        const normalized: DateString =
            !dateStrings || dateStrings.length === 0 || dateStrings[0] === '' ? [] : dateStrings;

        setdateStrings(normalized);
        setDateSearch(dates);
        // if(dateStrings)
        // console.log(dateStrings);

        disPatch(filterSlice.actions.setDate(normalized));
    };

    const handleChangeStatus = (value: string[]) => {
        // console.log(value);
        setStatusSearch(value);
        disPatch(filterSlice.actions.setStatus(value));
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
                                value={textSearch}
                                onChange={handleChangeText}
                            />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '6px' }} label={'Chọn ngày'} name={'filterDate'}>
                            <div>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    // value={selectedDates}
                                    format={'YYYY-MM-DD'}
                                    allowEmpty={true}
                                    value={dateSearch}
                                    onChange={(dates, dateStrings) => {
                                        handleChangeDate(dates, dateStrings);
                                    }}
                                />
                                <div className="animate-pulse mt-2 text-center" style={{ whiteSpace: 'pre-line' }}>
                                    {dateStrings?.length === 0 || dateStrings === null || dateStrings?.[0] === ''
                                        ? `Đăng hiển thị tất cả công việc!`
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
                                style={{ width: '100%' }}
                                options={options}
                                tagRender={tagRender}
                                value={statusSearch}
                                onChange={handleChangeStatus}
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

export default Filters;
