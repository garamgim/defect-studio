import { InputNumber, Form, Row, Col } from 'antd';

interface BatchParamsProps {
  batchCount: number;
  batchSize: number;
  setBatchCount: (value: number) => void;
  setBatchSize: (value: number) => void;
}

const BatchParams = ({ batchCount, batchSize, setBatchCount, setBatchSize }: BatchParamsProps) => {
  return (
    <div className="px-6 pt-6 pb-10">
      <p className="text-[14px] font-semibold text-[#222] mb-3 dark:text-gray-300">Batch Settings</p>
      <Form layout="vertical" className="space-y-4">
        <div className="flex justify-between gap-6">
          <Form.Item label="Batch count" className="mb-0">
            <Row gutter={16}>
              <Col span={24}>
                <InputNumber
                  value={batchCount}
                  onChange={(value) => {
                    if (value !== null) {
                      setBatchCount(value);
                    }
                  }}
                  className="w-full"
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="Batch size" className="mb-0">
            <Row gutter={16}>
              <Col span={24}>
                <InputNumber
                  value={batchSize}
                  onChange={(value) => {
                    if (value !== null) {
                      setBatchSize(value);
                    }
                  }}
                  className="w-full"
                />
              </Col>
            </Row>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default BatchParams;
