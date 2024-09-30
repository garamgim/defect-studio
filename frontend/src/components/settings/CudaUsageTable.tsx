import { useGetDeviceCudaUsage } from '@/hooks/settings/useGetStatus';
// import { queryClient } from '@/main';
import { Table, TableColumnsType } from 'antd';
import { GpuInfoType } from '@/types/settings';

// const refreshData = () => {
//   console.log('refreshing data', 'deviceCudaUsage');
//   queryClient.invalidateQueries({
//     queryKey: ['deviceCudaUsage']
//   });
// };

const columns: TableColumnsType<GpuInfoType> = [
  {
    title: 'GPU num',
    dataIndex: 'GPU num',
    key: 'GPU num'
  },
  {
    title: 'GPU name',
    dataIndex: 'GPU name',
    key: 'GPU name'
  }
];
const CudaUsageTable = () => {
  const { data, isPending, isError, error } = useGetDeviceCudaUsage();
  return (
    <div className="w-[90%] flex flex-col">
      {isPending && <div>Loading...</div>}
      {isError && <div>Error: {error?.message || 'Something Went Wrong'}</div>}
      {data && <Table columns={columns} dataSource={data} />}
    </div>
  );
};

export default CudaUsageTable;
