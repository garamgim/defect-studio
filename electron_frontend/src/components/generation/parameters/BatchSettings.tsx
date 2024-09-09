import { Input, Form, Row, Col } from 'antd';

interface BatchSettingsProps {
  batchCount: string;
  batchSize: string;
  setBatchCount: (value: string) => void;
  setBatchSize: (value: string) => void;
}

const BatchSettings = ({ batchCount, batchSize, setBatchCount, setBatchSize }: BatchSettingsProps) => {
  return (
    <div className="px-6 pt-6 pb-10">
      <p className="text-[14px] font-semibold text-[#222] mb-3 dark:text-gray-300">Batch Settings</p>
      <Form layout="vertical" className="space-y-4">
        <Form.Item label="Batch count" className="mb-0">
          <Row gutter={16}>
            <Col span={24}>
              <Input
                value={batchCount}
                onChange={(e) => setBatchCount(e.target.value)}
                placeholder="Enter batch count"
              />
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="Batch size" className="mb-0">
          <Row gutter={16}>
            <Col span={24}>
              <Input value={batchSize} onChange={(e) => setBatchSize(e.target.value)} placeholder="Enter batch size" />
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BatchSettings;
