import { useDepartmentTokenStatistic } from '../../../api/statistic_department';
import { Table } from 'antd';
import { ConfigProvider, theme } from 'antd'; //다크모드
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface StatisticSectionProps {
  // 필요한 Props 타입 정의
  departmentId: number;
}

const columns = [
  // Table 표 표시 목록
  {
    title: 'Date',
    dataIndex: 'create_date',
    key: 'create_date'
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: 'Log Type',
    dataIndex: 'log_type',
    key: 'log_type'
  }
];

const DepartmentStatistics = ({ departmentId }: StatisticSectionProps) => {
  const setThemeMode = useSelector((state: RootState) => state.theme.mode); //다크모드
  const { defaultAlgorithm, darkAlgorithm } = theme; //다크모드 테마 여부
  const { data, error, isLoading } = useDepartmentTokenStatistic({
    departmentId,
    start_date: '2020-01-01',
    end_date: '2025-12-31',
    log_type: 'distribute'
  });
  return (
    <div className="token-content mt-3 flex flex-col justify-center align-center">
      {error && <div>Error</div>}
      {isLoading && <div>Loading...</div>}
      {data && (
        <div>
          <section>
            <ConfigProvider
              theme={{
                algorithm: setThemeMode === 'dark' ? darkAlgorithm : defaultAlgorithm
              }}
            >
              <Table
                className={setThemeMode === 'dark' ? 'dark-table' : 'light-table'}
                columns={columns}
                dataSource={data}
                pagination={{
                  defaultPageSize: 5,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '15', '20']
                }}
              />
            </ConfigProvider>
          </section>
          <section></section>
        </div>
      )}
    </div>
  );
};

export default DepartmentStatistics;
