import { Table, TableColumnsType, ConfigProvider, theme } from 'antd';
import { GpuInfoType } from '@/types/settings';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const columns: TableColumnsType<GpuInfoType> = [
  {
    title: 'Number',
    dataIndex: 'GPU num',
    key: 'GPU num'
  },
  {
    title: 'GPU name',
    dataIndex: 'GPU name',
    key: 'GPU name'
  },
  {
    title: 'Total memory (MB)',
    dataIndex: 'Total memory (MB)',
    key: 'Total memory (MB)',
    sorter: (a, b) => a['Total memory (MB)'] - b['Total memory (MB)']
  },
  {
    title: 'Free memory (MB)',
    dataIndex: 'Free memory (MB)',
    key: 'Free memory (MB)',
    sorter: (a, b) => a['Free memory (MB)'] - b['Free memory (MB)']
  },
  {
    title: 'Used memory (MB)',
    dataIndex: 'Used memory (MB)',
    key: 'Used memory (MB)',
    sorter: (a, b) => a['Used memory (MB)'] - b['Used memory (MB)']
  },
  {
    title: 'Free memory (%)',
    dataIndex: 'Free memory (%)',
    key: 'Free memory (%)',
    sorter: (a, b) => a['Free memory (%)'] - b['Free memory (%)'],
    render: (value) => value.toFixed(2)
  }
];

interface CudaUsageTableProps {
  data: GpuInfoType[];
}
const CudaUsageTable = ({ data }: CudaUsageTableProps) => {
  const { defaultAlgorithm, darkAlgorithm } = theme;

  const setThemeMode = useSelector((state: RootState) => state.theme.mode);

  return (
    <div className="w-full flex flex-col mt-5">
      <ConfigProvider
        theme={{
          algorithm: setThemeMode === 'dark' ? darkAlgorithm : defaultAlgorithm
        }}
      >
        <Table columns={columns} dataSource={data.map((item, index) => ({ ...item, key: item['GPU num'] || index }))} />
      </ConfigProvider>
    </div>
  );
};

export default CudaUsageTable;
