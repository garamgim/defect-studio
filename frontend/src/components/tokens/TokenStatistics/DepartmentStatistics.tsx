import { useDepartmentTokenStatistic, getDepartmentTokenStatistic } from '../../../api/statistic_department';
interface StatisticSectionProps {
  departmentId: number;
}

const DepartmentStatistics = ({ departmentId }: StatisticSectionProps) => {
  const { data, error, isLoading } = useDepartmentTokenStatistic({
    departmentId,
    start_date: '2021-01-01',
    end_date: '2025-12-31',
    log_type: 'issue'
  });
  console.log(data);
  return <div className="token-content mt-3 flex flex-col justify-center align-center"></div>;
};

export default DepartmentStatistics;
