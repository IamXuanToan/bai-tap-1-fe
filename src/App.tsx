import { Col, Row } from 'antd';
import Filters from './components/Filters';
import ListTask from './components/ListTasks';

function App() {
    return (
        <div className="w-full px-5 mx-auto mt-10">
            <Row gutter={16}>
                <Col span={6}>
                    <div className="border-2 border-sky-500 rounded-lg w-full">
                        <Filters />
                    </div>
                </Col>
                <Col span={18}>
                    <div className="border-2 border-sky-500 rounded-lg w-full">
                        <ListTask />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default App;
