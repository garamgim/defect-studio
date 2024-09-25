import { Tabs, TabsProps } from 'antd';
import DepartmentStatistics from './DepartmentStatistics';
import DepartmentPersonStatistics from './DepartmentPersonStatistics';

interface StatisticSectionProps {
  departmentId: number;
}

// 부서 선택에 따라서
const StatisticSection = ({ departmentId }: StatisticSectionProps) => {
  // 선택옵션 - 부서, 개인

  const items: TabsProps['items'] = [
    { key: 'Department', label: 'Department', children: <DepartmentStatistics department_id={departmentId} /> },
    { key: 'You', label: 'You', children: <DepartmentPersonStatistics /> }
  ];

  return (
    <div className="flex flex-col justify-center align-middle">
      <Tabs items={items} defaultActiveKey="Department" />
    </div>
  );
};

export default StatisticSection;
