import { Tabs, TabsProps } from 'antd';
import { lazy, Suspense } from 'react';
const DepartmentImageUsage = lazy(
  () => import('@components/tokens/statistics/department/ImageUsage/DepartmentImageUsage')
);
const DepartmentToolUsage = lazy(() => import('../statistics/department/ToolUsage/DepartmentToolUsage'));
const DepartmentDistributionState = lazy(
  () => import('@components/tokens/statistics/department/DistributeState/DistributeState')
);

import TokenUsage from '@components/tokens/statistics/department/TokenUsage/TokenUsage';

interface DepartmentStatisticsProps {
  department_id: number;
}

const DepartmentStatistics = ({ department_id }: DepartmentStatisticsProps) => {
  const items: TabsProps['items'] = [
    { key: 'ImageUage', label: 'ImageUage', children: <DepartmentImageUsage department_id={department_id} /> },
    { key: 'ToolUsage', label: 'ToolUsage', children: <DepartmentToolUsage department_id={department_id} /> },
    {
      key: 'DistributionState',
      label: 'Distribution State',
      children: <DepartmentDistributionState department_id={department_id} />
    },
    {
      key: 'TokenUsage',
      label: 'Token Usage',
      children: <TokenUsage department_id={department_id} />
    }
  ];
  return (
    <div className="token-content">
      <Suspense fallback={<div>Loading...</div>}>
        <Tabs items={items} defaultActiveKey="ImageUage" destroyInactiveTabPane={true} />
      </Suspense>
    </div>
  );
};

export default DepartmentStatistics;
