import { Tag } from 'antd';

export default function setStatus(status: string) {
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
}
