import { Tabs, TabsProps } from 'antd';
import { lazy, Suspense } from 'react';
const DepartmentStatistics = lazy(() => import('./DepartmentStatistics'));
const DepartmentPersonStatistics = lazy(() => import('./DepartmentPersonStatistics'));

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
      <Suspense fallback={<div>Loading...</div>}>
        <Tabs items={items} defaultActiveKey="Department" />
      </Suspense>
    </div>
  );
};

export default StatisticSection;
