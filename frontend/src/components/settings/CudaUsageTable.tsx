import { useGetDeviceCudaUsage } from '@/hooks/settings/useGetStatus';
// import { queryClient } from '@/main';
import { Table, TableColumnsType, ConfigProvider, theme } from 'antd';
import { GpuInfoType } from '@/types/settings';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

// const refreshData = () => {
//   console.log('refreshing data', 'deviceCudaUsage');
//   queryClient.invalidateQueries({
//     queryKey: ['deviceCudaUsage']
//   });
// };

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
const CudaUsageTable = () => {
  const { data, isPending, isError, error } = useGetDeviceCudaUsage();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  const setThemeMode = useSelector((state: RootState) => state.theme.mode);

  return (
    <div className="w-full flex flex-col mt-5">
      {isPending && <div>Loading...</div>}
      {isError && <div>Error: {error?.message || 'Something Went Wrong'}</div>}
      {data && (
        <ConfigProvider
          theme={{
            algorithm: setThemeMode === 'dark' ? darkAlgorithm : defaultAlgorithm
          }}
        >
          <Table
            columns={columns}
            dataSource={data.map((item, index) => ({ ...item, key: item['GPU num'] || index }))}
          />
        </ConfigProvider>
      )}
    </div>
  );
};

export default CudaUsageTable;
