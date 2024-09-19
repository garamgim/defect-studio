import { get } from 'react-hook-form';
import { getPersonTokenLog } from '../../../api/statistic_person';

interface DepartmentPersonStatisticsProps {
  departmentId: number;
}

const getPersonTokenLogData = async () => {
  const response = await getPersonTokenLog({
    member_id: 1,
    start_date: '2021-01-01',
    end_date: '2024-12-31',
    use_type: 'text_to_image'
  });
  console.log(response);
};

const DepartmentPersonStatistics = ({ departmentId }: DepartmentPersonStatisticsProps) => {
  getPersonTokenLogData();
  return <div>{departmentId}</div>;
};

export default DepartmentPersonStatistics;
